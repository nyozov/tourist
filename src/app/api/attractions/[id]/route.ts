import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await the params promise
  const params = await context.params;
  const placeId = params.id;

  console.log("PLACE ID:", placeId);

  if (!placeId) {
    return NextResponse.json(
      { error: "Missing place ID" },
      { status: 400 }
    );
  }

  const bearerToken = process.env.FOURSQUARE_BEARER;
  const url = `https://places-api.foursquare.com/places/${placeId}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${bearerToken}`,
      "X-Places-Api-Version": "2025-06-17",
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
