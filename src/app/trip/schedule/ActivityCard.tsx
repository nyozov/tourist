"use client";

import { memo } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { useDraggable } from "@dnd-kit/core";
import { useTripContext } from "@/app/context/TripContext";
import { TiDelete } from "react-icons/ti";

// Predefined gradient combinations
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

const getGradientForActivity = (activityId: string) => {
  let hash = 0;
  for (let i = 0; i < activityId.length; i++) {
    hash = activityId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

interface ActivityCardProps {
  activity: any;
  day: string;
}

const ActivityCard = ({ activity, day }: ActivityCardProps) => {
  const { removeActivityFromDay } = useTripContext();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: activity.instanceId,
    data: { fromDay: day },
  });

  const gradientClass = getGradientForActivity(activity.id);


  const handleRemove = () => {
    removeActivityFromDay(day, activity.instanceId);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className={`shadow-sm ${gradientClass} cursor-move rounded-3xl`}>
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
            onPress={handleRemove}
            className="ml-2"
          >
            <TiDelete size={20}/>
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

// Memoize to fix drag and drop lag
export default memo(
  ActivityCard,
  (prev, next) =>
    prev.activity.instanceId === next.activity.instanceId &&
    prev.day === next.day
);
