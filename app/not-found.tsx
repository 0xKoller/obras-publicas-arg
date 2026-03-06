import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Pagina no encontrada
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
