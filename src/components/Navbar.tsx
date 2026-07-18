import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, Sparkles, CreditCard, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.home"), path: "/", icon: Home },
    { label: t("nav.dashboard"), path: "/dashboard", icon: LayoutDashboard },
    { label: t("nav.generator"), path: "/generator", icon: Sparkles },
    { label: t("nav.pricing"), path: "/pricing", icon: CreditCard },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
            <Home className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Real <span className="text-gold">Easy State</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          {user ? (
            <>
              <span className="text-sm text-muted-foreground font-body truncate max-w-[150px]">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1">
                <LogOut className="w-4 h-4" />
                {t("nav.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm">{t("nav.signIn")}</Button>
              </Link>
              <Link to="/auth">
                <Button variant="gold" size="sm">{t("nav.start")}</Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b border-border px-4 pb-4 animate-fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <div className="flex gap-2 mt-2">
              {user ? (
                <Button variant="outline" className="flex-1 gap-1" onClick={signOut}>
                  <LogOut className="w-4 h-4" /> {t("nav.signOut")}
                </Button>
              ) : (
                <>
                  <Link to="/auth" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">{t("nav.signIn")}</Button>
                  </Link>
                  <Link to="/auth" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="gold" className="w-full">{t("nav.start")}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
