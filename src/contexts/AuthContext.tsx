import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const STRIPE_TIERS = {
  basico: {
    price_id: "price_1TJvYqDERUtlqqYGoIH4W5ok",
    product_id: "prod_UIWcWSleCwYYyE",
  },
  premium: {
    price_id: "price_1TJvYwDERUtlqqYGDS0pp3Nr",
    product_id: "prod_UIWcBkUFPZMFt0",
  },
} as const;

interface SubscriptionInfo {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  subscription: SubscriptionInfo;
  checkSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const defaultSubscription: SubscriptionInfo = {
  subscribed: false,
  product_id: null,
  subscription_end: null,
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  subscription: defaultSubscription,
  checkSubscription: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo>(defaultSubscription);

  const checkSubscription = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscription(data as SubscriptionInfo);
    } catch {
      setSubscription(defaultSubscription);
    }
  }, []);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
        if (session) {
          setTimeout(() => checkSubscription(), 0);
        } else {
          setSubscription(defaultSubscription);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) checkSubscription();
    });

    return () => authSub.unsubscribe();
  }, [checkSubscription]);

  // Auto-refresh subscription every 60s
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [session, checkSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, subscription, checkSubscription, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
