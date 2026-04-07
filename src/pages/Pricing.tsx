import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    name: "Básico",
    price: "19",
    period: "/mês",
    description: "Ideal para consultores independentes que estão a começar.",
    icon: Zap,
    features: [
      "Até 10 anúncios/mês",
      "Descrições para portais",
      "3 legendas para redes sociais",
      "Guião de vídeo básico",
      "Dashboard de imóveis",
      "Suporte por email",
    ],
    cta: "Começar com Básico",
    variant: "navy" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "49",
    period: "/mês",
    description: "Para consultores profissionais que querem resultados máximos.",
    icon: Sparkles,
    features: [
      "Anúncios ilimitados",
      "Descrições premium com IA avançada",
      "5 legendas por imóvel",
      "Guião de vídeo profissional",
      "Dashboard com analytics",
      "Suporte prioritário 24/7",
      "Templates personalizados",
      "Exportação em múltiplos formatos",
    ],
    cta: "Começar com Premium",
    variant: "gold" as const,
    popular: true,
  },
];

export default function Pricing() {
  const handleSubscribe = (plan: string) => {
    // Simulated Stripe integration
    alert(`Redirecionando para o checkout do plano ${plan}... (integração Stripe simulada)`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Planos e <span className="text-gold-gradient">Preços</span>
            </h1>
            <p className="text-lg text-muted-foreground font-body">
              Escolha o plano que melhor se adapta ao seu negócio. Sem compromissos, cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? "border-2 border-gold shadow-lg shadow-gold/10"
                    : "glass-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient text-accent-foreground text-xs font-semibold font-body px-4 py-1.5 rounded-full">
                    Mais Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.popular ? "gold-gradient" : "navy-gradient"}`}>
                    <plan.icon className={`w-5 h-5 ${plan.popular ? "text-accent-foreground" : "text-primary-foreground"}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground">{plan.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground font-body mb-6">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-display font-bold text-foreground">€{plan.price}</span>
                  <span className="text-muted-foreground font-body">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm font-body">
                      <Check className={`w-4 h-4 shrink-0 ${plan.popular ? "text-gold" : "text-navy-light"}`} />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.variant}
                  size="lg"
                  className="w-full"
                  onClick={() => handleSubscribe(plan.name)}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
