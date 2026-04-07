import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Sparkles, Upload, X, FileText, Instagram, Video, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function Generator() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [typology, setTypology] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [highlights, setHighlights] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<null | {
    description: string;
    captions: string[];
    script: string;
  }>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      if (photos.length + newPhotos.length >= 5) return;
      newPhotos.push(URL.createObjectURL(file));
    });
    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (photos.length < 3) {
      toast.error("Adicione pelo menos 3 fotos.");
      return;
    }
    if (!typology || !location || !price) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setResults({
        description: `Descubra o encanto deste magnífico ${typology} em ${location}. Com uma localização privilegiada e acabamentos de excelência, esta propriedade é o cenário perfeito para quem procura conforto e sofisticação. ${highlights ? highlights + ". " : ""}Cada detalhe foi pensado para proporcionar uma experiência de vida única, onde a luz natural e os espaços amplos se conjugam harmoniosamente. Uma oportunidade imperdível por ${price}.`,
        captions: [
          `✨ ${typology} em ${location} — Onde o luxo encontra o conforto. ${price} 🏡\n\n#imobiliário #${location.toLowerCase().replace(/\s/g, "")} #luxo #realestate #casasdeluxo #portugal`,
          `🔑 Novo no mercado! ${typology} deslumbrante em ${location}. Vista de sonho, acabamentos premium. ${price}\n\n#novonoiporte #investimento #imóveis #${typology.toLowerCase()} #sonho`,
          `🏠 Imagine chegar a casa e ter isto. ${typology} em ${location} por ${price}. O seu próximo capítulo começa aqui.\n\n#homedecor #lifestyle #realestate #propriedade #portugal`,
        ],
        script: `[0-5s] Abertura: Plano aéreo suave da fachada do imóvel ao pôr do sol. Texto em ecrã: "${typology} · ${location}"\n\n[5-15s] Interior: Sequência de planos — sala de estar com luz natural, cozinha equipada, vista da varanda. Voz off: "Um espaço onde cada detalhe foi pensado para si."\n\n[15-25s] Lifestyle: Momentos de vida — café na varanda, família na sala, vista noturna da cidade. Texto: "${highlights || 'Acabamentos premium'}"\n\n[25-30s] Call to action: Logo do consultor + contacto. Texto: "Agende a sua visita. ${price}"`,
      });
      setIsGenerating(false);
      toast.success("Conteúdo gerado com sucesso!");
    }, 2500);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success("Copiado!");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Gerador de <span className="text-gold-gradient">Anúncios</span>
            </h1>
            <p className="text-muted-foreground font-body">
              Preencha os dados e deixe a IA criar conteúdo profissional para si.
            </p>
          </div>

          {/* Form */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
            {/* Photos */}
            <div className="mb-6">
              <Label className="text-base font-display font-semibold mb-3 block">
                Fotografias do Imóvel (3-5)
              </Label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border group">
                    <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-primary-foreground" />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gold/40 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-colors">
                    <Upload className="w-5 h-5 text-gold mb-1" />
                    <span className="text-xs text-muted-foreground font-body">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-body mt-2">
                {photos.length}/5 fotos adicionadas
              </p>
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="font-body mb-1.5 block">Tipologia *</Label>
                <Select value={typology} onValueChange={setTypology}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {["T0", "T1", "T2", "T3", "T4", "T5", "Moradia", "Terreno", "Loja"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body mb-1.5 block">Localização *</Label>
                <Input
                  placeholder="Ex: Lisboa, Chiado"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <Label className="font-body mb-1.5 block">Preço *</Label>
                <Input
                  placeholder="Ex: €450.000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6">
              <Label className="font-body mb-1.5 block">Pontos Fortes</Label>
              <Textarea
                placeholder="Ex: Vista mar, varanda espaçosa, acabamentos premium, garagem..."
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full gap-2"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  A gerar conteúdo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Anúncio com IA
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-6 animate-fade-in">
              {/* Description */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gold" />
                    <h3 className="font-display font-semibold text-foreground">Descrição para Portais</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyText(results.description, "desc")}
                    className="gap-1"
                  >
                    {copied === "desc" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copiar
                  </Button>
                </div>
                <p className="text-foreground/90 font-body leading-relaxed">{results.description}</p>
              </div>

              {/* Captions */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Instagram className="w-5 h-5 text-gold" />
                  <h3 className="font-display font-semibold text-foreground">Legendas para Redes Sociais</h3>
                </div>
                <div className="space-y-4">
                  {results.captions.map((caption, i) => (
                    <div key={i} className="bg-muted/50 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-foreground/90 font-body text-sm whitespace-pre-line flex-1">{caption}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyText(caption, `cap-${i}`)}
                          className="shrink-0"
                        >
                          {copied === `cap-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Script */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-gold" />
                    <h3 className="font-display font-semibold text-foreground">Guião de Vídeo (30s)</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyText(results.script, "script")}
                    className="gap-1"
                  >
                    {copied === "script" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copiar
                  </Button>
                </div>
                <p className="text-foreground/90 font-body leading-relaxed whitespace-pre-line text-sm">{results.script}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
