"use client";

import { useState } from "react";
import { useTripContext } from "@/app/context/TripContext";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import DayCard from "./DayCard";
import ActivityCard from "./ActivityCard";

export default function Schedule() {
  const { days, schedule, isLoading, moveActivityBetweenDays } =
    useTripContext();

  const [activeActivity, setActiveActivity] = useState<any>(null);

  if (isLoading) return <div>Loading...</div>;

  const handleDragStart = (event: any) => {
    const { active } = event;
    const activity = schedule[event.active.data.current.fromDay]?.find(
      (a) => a.instanceId === active.id
    );
    setActiveActivity(activity);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveActivity(null);

    if (!over) return;

    const instanceId = active.id;
    const fromDay = active.data.current?.fromDay;
    const toDay = over.id;

    if (fromDay && toDay && fromDay !== toDay) {
      moveActivityBetweenDays(fromDay, toDay, instanceId);
    }
  };

  const handleDragCancel = () => {
    setActiveActivity(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="h-full w-1/2 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {days.map((day, index) => (
            <DayCard
              key={day}
              day={day}
              index={index}
              activities={schedule[day] || []}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeActivity ? (
          <ActivityCard activity={activeActivity} day={activeActivity.day} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
