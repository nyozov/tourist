"use client";

import { useState, useEffect, useMemo } from "react";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { Card, CardBody, Button } from "@heroui/react";

interface MapProps {
  attractions: any[];
  onViewClick: (attraction: any) => void;
}

export default function Map({ attractions, onViewClick }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  // 👇 Only set center once
  const [initialCenter] = useState(() => {
    return attractions.length
      ? { lat: attractions[0].latitude, lng: attractions[0].longitude }
      : { lat: 0, lng: 0 };
  });

  const cards = useMemo(
    () =>
      attractions.map((place) => (
        <OverlayView
          key={place.fsq_place_id}
          position={{ lat: place.latitude, lng: place.longitude }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className="flex flex-col items-center cursor-pointer">
            <Card className="p-2 shadow-xl">
              <CardBody>
                <div className="flex flex-col gap-2">
                  <p className="font-bold">{place.name}</p>
                  <p className="text-tiny text-gray-600">
                    {(place.distance / 100).toFixed(1)} km
                  </p>
                  <Button
                    size="sm"
                    radius="full"
                    color="primary"
                    onPress={() => onViewClick(place.fsq_place_id)}
                  >
                    View
                  </Button>
                </div>
              </CardBody>
            </Card>
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-white shadow-md -mt-1" />
          </div>
        </OverlayView>
      )),
    [attractions, onViewClick]
  );

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={initialCenter} // only used on first render
      zoom={15}
      options={{
        gestureHandling: "greedy",
        disableDefaultUI: true,
        clickableIcons: false,
        mapTypeControl: false,
        streetViewControl: false,
      }}
    >
      {cards}
    </GoogleMap>
  );
}
