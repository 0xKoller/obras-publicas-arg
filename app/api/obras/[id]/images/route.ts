import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://mapainversiones.obraspublicas.gob.ar";

const imageCache = new Map<
  string,
  { images: { url: string; description: string }[]; timestamp: number }
>();
const IMAGE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate id: alphanumeric and hyphens only, max 50 characters
  if (!id || id.length > 50 || !/^[a-zA-Z0-9-]+$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid obra ID" },
      { status: 400 }
    );
  }

  const cached = imageCache.get(id);
  if (cached && Date.now() - cached.timestamp < IMAGE_CACHE_TTL) {
    return NextResponse.json(cached.images);
  }

  try {
    const profileUrl = `${BASE_URL}/Proyecto/PerfilProyecto/${id}`;
    const res = await fetch(profileUrl);
    if (!res.ok) {
      return NextResponse.json([]);
    }

    const html = await res.text();

    const imgRegex =
      /class="enlace_img"[^>]*data-src="([^"]*)"[^>]*descrip="([^"]*)"/g;
    const images: { url: string; description: string }[] = [];

    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const [, dataSrc, descrip] = match;
      images.push({
        url: `${BASE_URL}${dataSrc}`,
        description: descrip && descrip !== "NULL" ? descrip : "",
      });
    }

    imageCache.set(id, { images, timestamp: Date.now() });

    return NextResponse.json(images);
  } catch (error) {
    console.error(`[api/obras/${id}/images] Error scraping:`, error);
    return NextResponse.json([]);
  }
}
