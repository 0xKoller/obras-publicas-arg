"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, BarChart3, Map } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Mapa", icon: Map },
    { href: "/analytics", label: "Estadisticas", icon: BarChart3 },
  ];

  return (
    <header className="bg-gov-navy text-white shrink-0">
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
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 transition-colors ${
                  isActive
                    ? "text-white font-medium"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
