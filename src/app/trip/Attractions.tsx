"use client";
import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import Map from "./Map";
import AttractionSlider from "./AttractionSlider";

export default function Attractions() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const disclosure = useDisclosure(); // contains { isOpen, onOpen, onClose, onOpenChange }
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);

   const openDrawer = (attraction: any) => {
    setSelectedAttraction(attraction);
    disclosure.onOpen(); // opens the drawer
  };

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
      <Map attractions={attractions} onViewClick={openDrawer} />
      <AttractionSlider
        disclosure={disclosure}
        attraction={selectedAttraction}
      />
    </div>
  );
}
