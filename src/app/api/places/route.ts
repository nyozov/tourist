import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ features: [] });
  }

  const apiKey = process.env.GEOAPIFY_KEY;
  const res = await fetch(
    `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
      q
    )}&limit=5&apiKey=${apiKey}`
  );

  const data = await res.json();

  // Heroui AutocompleteItem formatting
  const items = data.features.map((f: any) => ({
    key: f.properties.place_id,
    label: f.properties.formatted,
    description: `${f.properties.city || f.properties.county || ""}, ${
      f.properties.country
    }`,
    lat: f.properties.lat,
    lon: f.properties.lon,
  }));

  return NextResponse.json(items);
}
