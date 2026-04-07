import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, LayoutDashboard, Sparkles, CreditCard, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Início", path: "/", icon: Home },
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Gerador", path: "/generator", icon: Sparkles },
  { label: "Preços", path: "/pricing", icon: CreditCard },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
            <Home className="w-4 h-4 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Immo<span className="text-gold">Elite</span>
          </span>
        </Link>

        {/* Desktop nav */}
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
          <Button variant="outline" size="sm">Entrar</Button>
          <Button variant="gold" size="sm">Começar Grátis</Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
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
              <Button variant="outline" className="flex-1">Entrar</Button>
              <Button variant="gold" className="flex-1">Começar</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
