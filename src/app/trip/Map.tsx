"use client";

import { useState, useMemo } from "react";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { Card, CardBody, Button, Skeleton } from "@heroui/react";

interface MapProps {
  attractions: any[];
  onViewClick: (attraction: any) => void;
}

const Map = ({ attractions, onViewClick }: MapProps) => {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

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
            <div className="w-1 h-2 border-l-4 border-r-4 border-t-8 border-transparent border-t-white shadow-md -mt-1" />
          </div>
        </OverlayView>
      )),
    [attractions, onViewClick]
  );

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg relative overflow-hidden">
        <div className="absolute top-[20%] left-[30%]">
          <Card className="w-48 shadow-xl">
            <CardBody className="gap-3">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-8 w-full rounded-full" />
            </CardBody>
          </Card>
        </div>

        <div className="absolute top-[50%] right-[25%]">
          <Card className="w-48 shadow-xl">
            <CardBody className="gap-3">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-8 w-full rounded-full" />
            </CardBody>
          </Card>
        </div>

        <div className="absolute bottom-[25%] left-[45%]">
          <Card className="w-48 shadow-xl">
            <CardBody className="gap-3">
              <Skeleton className="h-4 w-3/4 rounded-lg" />
              <Skeleton className="h-3 w-1/2 rounded-lg" />
              <Skeleton className="h-8 w-full rounded-full" />
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={initialCenter}
      zoom={15}
      options={{
        // disable extras from google maps
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
};

export default Map;
