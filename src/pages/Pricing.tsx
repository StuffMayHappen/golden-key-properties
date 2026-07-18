import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Loader2 } from "lucide-react";
import { useAuth, STRIPE_TIERS } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Pricing() {
  const { user, subscription, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentTier = subscription.subscribed
    ? Object.entries(STRIPE_TIERS).find(([, tt]) => tt.product_id === subscription.product_id)?.[0] ?? null
    : null;

  const plans = [
    {
      name: t("pricing.basicName"), key: "basico" as const, price: "19",
      description: t("pricing.basicDesc"), icon: Zap,
      features: t("pricing.basicFeatures", { returnObjects: true }) as string[],
      cta: t("pricing.basicCta"), variant: "navy" as const, popular: false,
    },
    {
      name: t("pricing.premiumName"), key: "premium" as const, price: "49",
      description: t("pricing.premiumDesc"), icon: Sparkles,
      features: t("pricing.premiumFeatures", { returnObjects: true }) as string[],
      cta: t("pricing.premiumCta"), variant: "gold" as const, popular: true,
    },
  ];

  const handleSubscribe = async (planKey: "basico" | "premium") => {
    if (!user) { navigate("/auth"); return; }
    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS[planKey].price_id },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || t("pricing.errorCheckout"));
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPlan("manage");
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error(err.message || t("pricing.errorPortal"));
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentPlanLabel = currentTier === "premium" ? t("pricing.premiumName") : currentTier === "basico" ? t("pricing.basicName") : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t("pricing.title")}</h1>
            <p className="text-lg text-muted-foreground font-body">{t("pricing.subtitle")}</p>
            {subscription.subscribed && (
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                <span className="text-sm text-muted-foreground font-body">
                  {t("pricing.currentPlan")} <strong className="text-foreground">{currentPlanLabel}</strong>
                </span>
                <Button variant="outline" size="sm" onClick={handleManageSubscription} disabled={loadingPlan === "manage"}>
                  {loadingPlan === "manage" ? <Loader2 className="w-4 h-4 animate-spin" /> : t("pricing.manage")}
                </Button>
                <Button variant="ghost" size="sm" onClick={checkSubscription}>{t("pricing.refresh")}</Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => {
              const isCurrentPlan = currentTier === plan.key;
              const isLoading = loadingPlan === plan.key;
              return (
                <div key={plan.name}
                  className={`relative rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl ${
                    plan.popular ? "border-2 border-gold shadow-lg shadow-gold/10" : "glass-card"
                  } ${isCurrentPlan ? "ring-2 ring-green-500/50" : ""}`}>
                  {isCurrentPlan && (
                    <div className="absolute -top-4 right-4 bg-green-500 text-white text-xs font-semibold font-body px-3 py-1 rounded-full">
                      {t("pricing.yourPlan")}
                    </div>
                  )}
                  {plan.popular && !isCurrentPlan && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 gold-gradient text-accent-foreground text-xs font-semibold font-body px-4 py-1.5 rounded-full">
                      {t("pricing.popular")}
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
                    <span className="text-muted-foreground font-body">{t("pricing.month")}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-body">
                        <Check className={`w-4 h-4 shrink-0 ${plan.popular ? "text-gold" : "text-navy-light"}`} />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.variant} size="lg" className="w-full"
                    onClick={() => isCurrentPlan ? handleManageSubscription() : handleSubscribe(plan.key)}
                    disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isCurrentPlan ? t("pricing.manage") : plan.cta}
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
