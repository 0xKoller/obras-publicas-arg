import { Suspense } from "react";
import ClientApp from "@/components/ClientApp";
import Footer from "@/components/Footer";
import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Government Header */}
      <header className="bg-gov-navy text-white shrink-0">
        {/* Thin celeste accent line */}
        <div className="h-1 bg-gov-celeste" />

        <div className="max-w-full px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gov-celeste" />
            <div>
              <h1 className="text-base font-semibold leading-tight">
                Mapa de Obras Publicas
              </h1>
              <p className="text-[11px] text-white/60 leading-tight">
                Republica Argentina
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <span className="text-white/60 hover:text-white cursor-pointer transition-colors">
              Datos Abiertos
            </span>
            <span className="text-white/60 hover:text-white cursor-pointer transition-colors">
              Acerca de
            </span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <Suspense>
        <ClientApp />
      </Suspense>

      {/* Footer */}
      <Footer />
    </div>
  );
}
