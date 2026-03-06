import { Suspense } from "react";
import ClientApp from "@/components/ClientApp";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
