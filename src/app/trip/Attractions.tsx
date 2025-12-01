"use client";
import { useState, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import Map from "./Map";
import AttractionSlider from "./AttractionSlider";

const Attractions = () => {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const disclosure = useDisclosure(); // contains { isOpen, onOpen, onClose, onOpenChange }
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);
  const [isLoadingAttraction, setIsLoadingAttraction] = useState(false);

  const openDrawer = async (attractionId: string) => {
    setIsLoadingAttraction(true);
    disclosure.onOpen();

    try {
      const res = await fetch(`/api/attractions/${attractionId}`);
      const data = await res.json();

      console.log("attraction details data:", data);

      setSelectedAttraction(data);
    } catch (err) {
      console.error("Error fetching details", err);
    } finally {
      setIsLoadingAttraction(false);
    }
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
        isLoading={isLoadingAttraction}
      />
    </div>
  );
}

export default Attractions;
