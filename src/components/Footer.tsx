import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="navy-gradient text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <Home className="w-4 h-4 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold">
              Immo<span className="text-gold">Elite</span>
            </span>
          </div>
          <p className="text-sm text-gold-light/70">
            © 2026 ImmoElite. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
