"use client";

import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";
import { useTripContext } from "@/app/context/TripContext";

// Gradients that can be assigned to activity cards
const gradients = [
  "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-200",
  "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-200",
  "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-200",
  "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-200",
  "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-200",
  "bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-pink-200",
  "bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-200",
  "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-200",
];

// Assign gradient based on id
const getGradientForActivity = (activityId: string) => {
  let hash = 0;
  for (let i = 0; i < activityId.length; i++) {
    hash = activityId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

export default function Schedule() {
  const { days, schedule, isLoading, removeActivityFromDay } = useTripContext();

  if (isLoading) {
    return <div className="h-full w-1/2 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-full w-1/2 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {days.map((day, index) => (
          <Card key={day} className="shadow-sm">
            <CardHeader className="flex justify-between items-center pb-2">
              <div>
                <Chip size="sm" variant="flat" color="default" className="mb-1">
                  Day {index + 1}
                </Chip>
                <p className="text-sm font-semibold">
                  {new Date(day).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </p>
              </div>
              <Button isIconOnly size="sm" variant="light" color="primary">
                +
              </Button>
            </CardHeader>

            <CardBody className="pt-0">
              {schedule[day]?.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-xs border-1 rounded-3xl">
                  No activities added yet
                </div>
              ) : (
                <div className="space-y-2">
                  {schedule[day]?.map((activity) => {
                    const gradientClass = getGradientForActivity(activity.id);
                    return (
                      <Card 
                        key={activity.instanceId} 
                        className={`shadow-sm ${gradientClass} rounded-3xl transition-all hover:shadow-md hover:scale-[1.02]`}
                      >
                        <CardBody className="p-3 flex flex-row justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.name}</p>
                            {activity.location?.address && (
                              <p className="text-xs text-gray-600 mt-1">
                                {activity.location.address}
                              </p>
                            )}
                          </div>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => removeActivityFromDay(day, activity.instanceId)}
                            className="ml-2"
                          >
                            ×
                          </Button>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
