import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Sparkles, Upload, X, FileText, Instagram, Video, Loader2, Copy, Check, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, STRIPE_TIERS, getTierFromProductId } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function Generator() {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [typology, setTypology] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [highlights, setHighlights] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [results, setResults] = useState<null | {
    description: string;
    captions: string[];
    script: string;
  }>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const currentTier = getTierFromProductId(subscription.product_id);
  const tierLimits = currentTier ? STRIPE_TIERS[currentTier].limits : null;

  const { data: monthlyCount = 0 } = useQuery({
    queryKey: ["monthly-ad-count", user?.id],
    queryFn: async () => {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count, error } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const isAtLimit = !subscription.subscribed
    ? true
    : tierLimits
      ? monthlyCount >= tierLimits.adsPerMonth
      : false;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      if (photos.length + newFiles.length >= 5) return;
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });
    setPhotos([...photos, ...newFiles]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!subscription.subscribed) { toast.error(t("generator.needSub")); return; }
    if (isAtLimit) { toast.error(t("generator.limitReached", { max: tierLimits?.adsPerMonth })); return; }
    if (photos.length < 3) { toast.error(t("generator.needPhotos")); return; }
    if (!typology || !location || !price || !title) { toast.error(t("generator.fillFields")); return; }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-property-content", {
        body: { typology, location, price, highlights },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); setIsGenerating(false); return; }
      setResults({ description: data.description, captions: data.captions, script: data.script });
      toast.success(t("generator.generatedSuccess"));
    } catch (error: any) {
      toast.error(error.message || t("generator.errorAI"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!results || !user) return;
    setIsSaving(true);
    try {
      const photoUrls: string[] = [];
      for (const file of photos) {
        const filePath = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("property-photos").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("property-photos").getPublicUrl(filePath);
        photoUrls.push(urlData.publicUrl);
      }
      const { error } = await supabase.from("properties").insert({
        user_id: user.id, title, typology, location, price, highlights,
        photos: photoUrls, description: results.description, captions: results.captions,
        video_script: results.script, status: "published",
      });
      if (error) throw error;
      toast.success(t("generator.savedSuccess"));
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || t("generator.errorSave"));
    } finally {
      setIsSaving(false);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(t("generator.copied"));
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("generator.title")}
            </h1>
            <p className="text-muted-foreground font-body">{t("generator.subtitle")}</p>
          </div>

          {!subscription.subscribed ? (
            <div className="rounded-2xl border border-gold/30 bg-gold/5 p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
              <AlertTriangle className="w-6 h-6 text-gold shrink-0" />
              <div className="flex-1 text-center sm:text-left">
                <p className="font-display font-semibold text-foreground">{t("generator.subNeeded")}</p>
                <p className="text-sm text-muted-foreground font-body">{t("generator.subNeededDesc")}</p>
              </div>
              <Link to="/pricing"><Button variant="gold" size="sm">{t("dashboard.viewPlans")}</Button></Link>
            </div>
          ) : tierLimits && tierLimits.adsPerMonth !== Infinity && (
            <div className="rounded-2xl border border-border bg-muted/30 p-4 mb-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-body text-muted-foreground">
                  {t("generator.adsThisMonth")} <strong className="text-foreground">{monthlyCount}/{tierLimits.adsPerMonth}</strong>
                </p>
                {isAtLimit && (
                  <Link to="/pricing"><Button variant="gold" size="sm">{t("generator.upgrade")}</Button></Link>
                )}
              </div>
              {tierLimits.adsPerMonth > 0 && (
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full gold-gradient transition-all duration-500"
                    style={{ width: `${Math.min((monthlyCount / tierLimits.adsPerMonth) * 100, 100)}%` }} />
                </div>
              )}
            </div>
          )}

          <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
            <div className="mb-4">
              <Label className="font-body mb-1.5 block">{t("generator.propertyTitle")}</Label>
              <Input placeholder={t("generator.propertyTitlePh")} value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="mb-6">
              <Label className="text-base font-display font-semibold mb-3 block">{t("generator.photos")}</Label>
              <div className="flex flex-wrap gap-3">
                {photoPreviews.map((photo, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                    <img src={photo} alt={`${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => removePhoto(i)}
                      className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <X className="w-5 h-5 text-primary-foreground" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gold/40 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
                    <Upload className="w-5 h-5 text-gold mb-1" />
                    <span className="text-xs text-muted-foreground font-body">{t("generator.upload")}</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-body mt-2">{t("generator.photosCount", { count: photos.length })}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="font-body mb-1.5 block">{t("generator.typology")}</Label>
                <Select value={typology} onValueChange={setTypology}>
                  <SelectTrigger><SelectValue placeholder={t("generator.typologyPh")} /></SelectTrigger>
                  <SelectContent>
                    {["T0", "T1", "T2", "T3", "T4", "T5", "Moradia", "Terreno", "Loja"].map((t2) => (
                      <SelectItem key={t2} value={t2}>{t2}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body mb-1.5 block">{t("generator.location")}</Label>
                <Input placeholder={t("generator.locationPh")} value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div>
                <Label className="font-body mb-1.5 block">{t("generator.price")}</Label>
                <Input placeholder={t("generator.pricePh")} value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            </div>

            <div className="mb-6">
              <Label className="font-body mb-1.5 block">{t("generator.highlights")}</Label>
              <Textarea placeholder={t("generator.highlightsPh")} value={highlights}
                onChange={(e) => setHighlights(e.target.value)} rows={3} />
            </div>

            <Button variant="gold" size="lg" className="w-full gap-2" onClick={handleGenerate}
              disabled={isGenerating || !subscription.subscribed || isAtLimit}>
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t("generator.generating")}</>
              ) : (
                <><Sparkles className="w-5 h-5" /> {t("generator.generate")}</>
              )}
            </Button>
          </div>

          {results && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold" />
                    <h3 className="font-display font-semibold text-foreground">{t("generator.descTitle")}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyText(results.description, "desc")} className="gap-1">
                    {copied === "desc" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {t("generator.copy")}
                  </Button>
                </div>
                <p className="text-foreground/90 font-body leading-relaxed">{results.description}</p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Instagram className="w-5 h-5 text-gold" />
                  <h3 className="font-display font-semibold text-foreground">{t("generator.captionsTitle")}</h3>
                </div>
                <div className="space-y-4">
                  {results.captions.map((caption, i) => (
                    <div key={i} className="bg-muted/50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-foreground/90 font-body text-sm whitespace-pre-line flex-1">{caption}</p>
                        <Button variant="ghost" size="sm" onClick={() => copyText(caption, `cap-${i}`)} className="shrink-0">
                          {copied === `cap-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-gold" />
                    <h3 className="font-display font-semibold text-foreground">{t("generator.scriptTitle")}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyText(results.script, "script")} className="gap-1">
                    {copied === "script" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {t("generator.copy")}
                  </Button>
                </div>
                <p className="text-foreground/90 font-body leading-relaxed whitespace-pre-line text-sm">{results.script}</p>
              </div>

              <Button variant="gold" size="lg" className="w-full gap-2" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {t("generator.saving")}</>
                ) : (
                  <><Save className="w-5 h-5" /> {t("generator.save")}</>
                )}
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
