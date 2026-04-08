import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Loader2 } from "lucide-react";
import { useAuth, STRIPE_TIERS } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const plans = [
  {
    name: "Básico",
    key: "basico" as const,
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
    key: "premium" as const,
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
  const { user, subscription, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentTier = subscription.subscribed
    ? Object.entries(STRIPE_TIERS).find(([, t]) => t.product_id === subscription.product_id)?.[0] ?? null
    : null;

  const handleSubscribe = async (planKey: "basico" | "premium") => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS[planKey].price_id },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar sessão de pagamento");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPlan("manage");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao abrir portal");
    } finally {
      setLoadingPlan(null);
    }
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
            {subscription.subscribed && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <span className="text-sm text-muted-foreground font-body">
                  Plano atual: <strong className="text-foreground capitalize">{currentTier}</strong>
                </span>
                <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={loadingPlan === "manage"}>
                  {loadingPlan === "manage" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gerir Subscrição"}
                </Button>
                <Button variant="ghost" size="sm" onClick={checkSubscription}>
                  Atualizar estado
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => {
              const isCurrentPlan = currentTier === plan.key;
              const isLoading = loadingPlan === plan.key;

              return (
                <div
                  key={plan.name}
                  className={`relative rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl ${
                    plan.popular
                      ? "border-2 border-gold shadow-lg shadow-gold/10"
                      : "glass-card"
                  } ${isCurrentPlan ? "ring-2 ring-green-500/50" : ""}`}
                >
                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4 bg-green-500 text-white text-xs font-semibold font-body px-3 py-1 rounded-full">
                      O Seu Plano
                    </div>
                  )}
                  {plan.popular && !isCurrentPlan && (
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
                    onClick={() => isCurrentPlan ? handleManageSubscription() : handleSubscribe(plan.key)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCurrentPlan ? (
                      "Gerir Subscrição"
                    ) : (
                      plan.cta
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
