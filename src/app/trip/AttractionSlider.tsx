import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Button,
} from "@heroui/react";
import { useTripContext } from "@/app/context/TripContext";
import { useState } from "react";

const AttractionSlider = ({ disclosure, attraction, isLoading }) => {
  const { days, addActivityToDay } = useTripContext();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { isOpen, onClose, onOpenChange } = disclosure;

  const handleAddToSchedule = () => {
    if (selectedDay && attraction) {
      addActivityToDay(selectedDay, {
        id: attraction.fsq_place_id,
        name: attraction.name,
        ...attraction,
      });

      onClose();

      setSelectedDay(null);
    }
  };

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader>
              {attraction?.name || "No attraction selected"}
            </DrawerHeader>
            <DrawerBody className="gap-6">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">Loading details...</p>
                </div>
              )}

              {!isLoading && attraction && (
                <>
                  {/* Attraction Details */}
                  <div className="space-y-2 w-full">
                    <p className="text-sm text-gray-600">
                      {attraction.location?.address}
                    </p>
                    {/* Add more attraction details here */}
                    <p className="text-xs wrap-break-word">{JSON.stringify(attraction)}</p>
                  </div>

                  {/* Day Selector Section */}
                  <div className="border-t pt-4 space-y-3">
                    <p className="text-sm font-semibold">
                      Add to your schedule
                    </p>

                    <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto">
                      {days.map((day, index) => {
                        const isSelected = selectedDay === day;
                        return (
                          <Button
                            key={day}
                            radius="full"
                            size="sm"
                            variant={isSelected ? "solid" : "bordered"}
                            color={isSelected ? "primary" : "default"}
                            onPress={() => setSelectedDay(day)}
                            className="flex-col h-auto py-2"
                          >
                            <span className="text-xs font-semibold">
                              Day {index + 1}
                            </span>
                            <span className="text-xs">
                              {new Date(day).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      color="primary"
                      radius="full"
                      isDisabled={!selectedDay}
                      onPress={handleAddToSchedule}
                      className="w-full"
                    >
                      {selectedDay ? "Add to Schedule" : "Select a day"}
                    </Button>
                  </div>
                </>
              )}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AttractionSlider;
