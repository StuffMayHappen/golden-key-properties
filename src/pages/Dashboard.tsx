import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Eye, Copy, Trash2, MapPin, Home, Tag, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Imóvel eliminado.");
    },
  });

  const copyContent = (property: any) => {
    const text = `${property.title}\n${property.typology} · ${property.location}\n${property.price}\n\n${property.description || ""}`;
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const published = properties?.filter((p) => p.status === "published").length ?? 0;
  const drafts = properties?.filter((p) => p.status === "draft").length ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Meus Imóveis</h1>
              <p className="text-muted-foreground font-body mt-1">
                Olá, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <Link to="/generator">
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" /> Novo Anúncio
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Imóveis", value: properties?.length ?? 0 },
              { label: "Publicados", value: published },
              { label: "Rascunhos", value: drafts },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-5">
                <p className="text-sm text-muted-foreground font-body">{s.label}</p>
                <p className="text-3xl font-bold font-display text-foreground mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : properties?.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-2xl">
              <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">Sem imóveis ainda</h3>
              <p className="text-muted-foreground font-body mb-6">Crie o seu primeiro anúncio com IA.</p>
              <Link to="/generator">
                <Button variant="gold" className="gap-2">
                  <Plus className="w-4 h-4" /> Criar Primeiro Anúncio
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <div
                  key={property.id}
                  className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {property.photos && property.photos.length > 0 ? (
                      <img
                        src={property.photos[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 text-xs font-semibold font-body px-3 py-1 rounded-full ${
                        property.status === "published"
                          ? "gold-gradient text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {property.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                      {property.title}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground font-body">
                      <div className="flex items-center gap-2">
                        <Home className="w-3.5 h-3.5" /> {property.typology}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" /> {property.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5" /> {property.price}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="gap-1 flex-1" onClick={() => copyContent(property)}>
                        <Copy className="w-3.5 h-3.5" /> Copiar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive"
                        onClick={() => deleteMutation.mutate(property.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
