import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const { checkSubscription } = useAuth();

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md space-y-6 animate-fade-in">
        <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-display font-bold text-foreground">
          Pagamento Confirmado!
        </h1>

        <p className="text-muted-foreground font-body">
          A sua subscrição foi ativada com sucesso. Já pode começar a gerar anúncios profissionais para os seus imóveis.
        </p>

        <Button variant="gold" size="lg" onClick={() => navigate("/dashboard")} className="gap-2">
          Ir para o Dashboard <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
