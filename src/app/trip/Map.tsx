"use client";

import { useState, memo, useMemo } from "react";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";

export default function Map({ attractions }: { attractions: any[] }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
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
            <div className="flex flex-col items-center">
              <div className=" bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center">
                <Card>
                  <CardBody>
                    <div className="w-full h-full flex flex-col">
                      <p className="font-bold text-nowrap">{place.name}</p>
                      <div className="flex flex-row items-center mt-2">
                        <p className="text-nowrap text-tiny text-gray-500">
                          {place.distance / 100} km
                        </p>
                        <Button
                          size="sm"
                          radius="full"
                          color="primary"
                          className="ms-4"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
              <div
                className="w-1 border-l-4 border-r-4 border-t-8 border-transparent 
               border-t-white shadow-md -mt-1"
              />
            </div>
          </div>
        </OverlayView>
      )),
    [attractions]
  );

  if (!isLoaded) return <div>Loading map...</div>;

  const center = attractions.length
    ? { lat: attractions[0].latitude, lng: attractions[0].longitude }
    : { lat: 0, lng: 0 };

  return (
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={center}
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
