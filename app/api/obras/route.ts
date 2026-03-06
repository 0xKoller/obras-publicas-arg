import { NextResponse } from "next/server";
import { fetchObras } from "@/lib/data/fetch-obras";

export async function GET() {
  try {
    const obras = await fetchObras();
    return NextResponse.json(obras);
  } catch (error) {
    console.error("[api/obras] Error:", error);
    return NextResponse.json(
      { error: "Error al cargar las obras" },
      { status: 500 }
    );
  }
}
