import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Sparkles, BarChart3, Instagram, Video, ArrowRight, Building2, TrendingUp, Users } from "lucide-react";
import heroImage from "@/assets/hero-property.jpg";

const features = [
  {
    icon: Sparkles,
    title: "Textos com IA",
    description: "Gere descrições emocionais e profissionais para portais imobiliários em segundos.",
  },
  {
    icon: Instagram,
    title: "Legendas para Redes Sociais",
    description: "3 legendas criativas com hashtags otimizadas para Instagram e TikTok.",
  },
  {
    icon: Video,
    title: "Guiões de Vídeo",
    description: "Guiões de 30 segundos prontos para Reels de apresentação do imóvel.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    description: "Acompanhe todos os seus imóveis e anúncios gerados num só lugar.",
  },
];

const stats = [
  { icon: Building2, value: "2.500+", label: "Imóveis anunciados" },
  { icon: Users, value: "850+", label: "Consultores ativos" },
  { icon: TrendingUp, value: "3x", label: "Mais rapidez" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Apartamento de luxo"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/90 via-navy/70 to-navy-dark/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 text-sm font-body text-gold">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-gold-light">
              Anúncios que{" "}
              <span className="text-gold-gradient">vendem imóveis</span>
            </h1>
            <p className="text-lg md:text-xl text-gold-light/80 font-body max-w-lg leading-relaxed">
              Gere textos profissionais, legendas para redes sociais e guiões de
              vídeo com inteligência artificial. Em segundos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/generator">
                <Button variant="gold" size="xl" className="gap-2">
                  Começar Agora
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="xl" className="border-gold/30 text-gold-light hover:bg-gold/10 hover:text-gold">
                  Ver Preços
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 navy-gradient">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 justify-center">
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-gold">{stat.value}</p>
                  <p className="text-sm text-gold-light/70 font-body">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo o que precisa, <span className="text-gold-gradient">num clique</span>
            </h2>
            <p className="text-muted-foreground font-body text-lg">
              Ferramentas de IA desenhadas especificamente para consultores imobiliários.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground font-body">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 navy-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display text-gold-light mb-6">
            Pronto para vender mais <span className="text-gold-gradient">rápido</span>?
          </h2>
          <p className="text-gold-light/70 font-body text-lg max-w-lg mx-auto mb-8">
            Junte-se a centenas de consultores que já transformaram a forma como anunciam imóveis.
          </p>
          <Link to="/generator">
            <Button variant="gold" size="xl" className="gap-2">
              Experimentar Grátis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
