import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const lat = request.headers.get("x-vercel-ip-latitude");
  const lng = request.headers.get("x-vercel-ip-longitude");

  if (lat && lng) {
    return NextResponse.json({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    });
  }

  return NextResponse.json(null);
}
