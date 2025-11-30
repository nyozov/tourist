import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lon = searchParams.get("lon");
  const lat = searchParams.get("lat");

  if (!lon || !lat) {
    return NextResponse.json({ results: [] });
  }

  const bearerToken = process.env.FOURSQUARE_BEARER;
  if (!bearerToken) {
    return NextResponse.json({ error: "Missing FOURSQUARE_BEARER key" }, { status: 500 });
  }

  const categories = [
    "16000", "16021", "16024", "16025", "16030",
    "16032", "16033", "16026", "18000", "13003",
    "13004", "11046"
  ].join(",");

  const url = `https://places-api.foursquare.com/places/search?ll=${lat},${lon}&categories=${categories}&radius=5000&limit=10&`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
      "X-Places-Api-Version": "2025-06-17",
    },
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errText = await res.text();
      console.error("Foursquare API error:", errText);
      return NextResponse.json({ error: "Foursquare fetch failed", details: errText }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Foursquare fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch from Foursquare", details: err.message || err },
      { status: 500 }
    );
  }
}
