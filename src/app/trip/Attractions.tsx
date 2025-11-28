"use client";
import { useState, useEffect } from "react";
import { Card, CardFooter, Image, Button } from "@heroui/react";
import Map from "./Map";

export default function Attractions() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lon = params.get("lon");

    fetch(`/api/attractions?lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((data) => {
        setAttractions(data.results || []);
        setLoading(false);
        console.log("attractions data:", data.results);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="w-full">Loading...</div>;

  return (
    <div className="h-full w-full">
        <Map attractions={attractions} />
    </div>
  );
}
