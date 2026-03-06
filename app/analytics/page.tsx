import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalyticsClient from "@/components/analytics/AnalyticsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estadisticas - Obras Publicas Argentina",
  description:
    "Analisis estadistico de las obras publicas por periodo presidencial",
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AnalyticsClient />
      <Footer />
    </div>
  );
}
