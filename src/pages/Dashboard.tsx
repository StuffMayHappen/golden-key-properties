import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Eye, Copy, Trash2, MapPin, Home, Tag } from "lucide-react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const mockProperties = [
  {
    id: 1,
    title: "Villa Moderna com Piscina",
    typology: "T4",
    location: "Cascais",
    price: "€1.250.000",
    image: property1,
    status: "Publicado",
    date: "2 Abr 2026",
  },
  {
    id: 2,
    title: "Penthouse Panorâmico",
    typology: "T3",
    location: "Lisboa, Parque das Nações",
    price: "€890.000",
    image: property2,
    status: "Rascunho",
    date: "5 Abr 2026",
  },
  {
    id: 3,
    title: "Townhouse com Jardim",
    typology: "T5",
    location: "Sintra",
    price: "€680.000",
    image: property3,
    status: "Publicado",
    date: "7 Abr 2026",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Meus Imóveis
              </h1>
              <p className="text-muted-foreground font-body mt-1">
                Gerencie os seus anúncios e propriedades.
              </p>
            </div>
            <Link to="/generator">
              <Button variant="gold" className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Anúncio
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Imóveis", value: "3", color: "bg-primary" },
              { label: "Publicados", value: "2", color: "gold-gradient" },
              { label: "Rascunhos", value: "1", color: "bg-muted" },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-5">
                <p className="text-sm text-muted-foreground font-body">{s.label}</p>
                <p className="text-3xl font-bold font-display text-foreground mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProperties.map((property) => (
              <div
                key={property.id}
                className="glass-card rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                  <span
                    className={`absolute top-3 right-3 text-xs font-semibold font-body px-3 py-1 rounded-full ${
                      property.status === "Publicado"
                        ? "gold-gradient text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    {property.title}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground font-body">
                    <div className="flex items-center gap-2">
                      <Home className="w-3.5 h-3.5" />
                      {property.typology}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {property.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      {property.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm" className="gap-1 flex-1">
                      <Eye className="w-3.5 h-3.5" /> Ver
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 flex-1">
                      <Copy className="w-3.5 h-3.5" /> Copiar
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
