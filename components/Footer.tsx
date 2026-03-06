export default function Footer() {
  return (
    <footer className="bg-gov-navy text-white">
      {/* Argentine flag accent line */}
      <div className="flex h-1">
        <div className="flex-1 bg-gov-celeste" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-gov-celeste" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Republica Argentina
            </h3>
            <p className="text-sm text-white/70">
              Mapa de inversiones en obras publicas. Datos abiertos del
              Ministerio de Obras Publicas.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Enlaces
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a
                  href="https://www.argentina.gob.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Argentina.gob.ar
                </a>
              </li>
              <li>
                <a
                  href="https://mapainversiones.obraspublicas.gob.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Mapa de Inversiones
                </a>
              </li>
              <li>
                <a
                  href="https://datos.gob.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Datos Abiertos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">
              Contacto
            </h3>
            <p className="text-sm text-white/70">
              Los datos se obtienen del portal de datos abiertos del gobierno
              argentino.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20 text-center text-xs text-white/50">
          Datos abiertos - Ministerio de Obras Publicas de la Nacion Argentina
        </div>
      </div>
    </footer>
  );
}
