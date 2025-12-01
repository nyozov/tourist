"use client";

import { memo } from "react";
import { Card, CardHeader, CardBody, Chip } from "@heroui/react";
import { useDroppable } from "@dnd-kit/core";
import ActivityCard from "./ActivityCard";

interface DayCardProps {
  day: string;
  index: number;
  activities: any[];
}

const DayCard = ({ day, index, activities }: DayCardProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day,
  });

  return (
    <Card className="shadow-sm">
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
      </CardHeader>

      <CardBody>
        <div
          ref={setNodeRef}
          className={`pt-0 transition-colors rounded-3xl ${
            isOver ? "bg-blue-100" : ""
          }`}
        >
          {activities.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-xs border rounded-3xl">
              No activities yet
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.instanceId}
                  activity={activity}
                  day={day}
                />
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};


// Memoize to fix drag and drop lag, not sure if this one is needed here
export default memo(DayCard, (prev, next) => {
  return (
    prev.day === next.day &&
    prev.index === next.index &&
    prev.activities === next.activities
  );
});
