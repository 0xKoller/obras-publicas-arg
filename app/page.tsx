import { Suspense } from "react";
import type { Metadata } from "next";
import ClientApp from "@/components/ClientApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { fetchObras } from "@/lib/data/fetch-obras";

const defaultMetadata: Metadata = {
  title: "Mapa de Obras Publicas - Argentina",
  description:
    "Visualizacion interactiva de las obras publicas de Argentina",
  openGraph: {
    title: "Mapa de Obras Publicas - Argentina",
    description:
      "Visualizacion interactiva de las obras publicas de Argentina",
    type: "website",
    locale: "es_AR",
    siteName: "Mapa de Obras Publicas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa de Obras Publicas - Argentina",
    description:
      "Visualizacion interactiva de las obras publicas de Argentina",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ obra?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const obraId = params.obra;

  if (!obraId) {
    return defaultMetadata;
  }

  try {
    const obras = await fetchObras();
    const obra = obras.find((o) => o.id === obraId);

    if (!obra) {
      return defaultMetadata;
    }

    const title = obra.nombre;
    const description = `${obra.descripcion || obra.nombre} - ${obra.provincia}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        locale: "es_AR",
        siteName: "Mapa de Obras Publicas",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return defaultMetadata;
  }
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Suspense>
        <ClientApp />
      </Suspense>
      <Footer />
    </div>
  );
}
