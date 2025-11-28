"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Button, Chip } from "@heroui/react";

export default function Schedule() {
  const [days, setDays] = useState([]);
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const start = params.get("start");
    const end = params.get("end");

    const daysList = getDays(start, end);
    setDays(daysList);

    const initSchedule = {};
    daysList.forEach((day) => (initSchedule[day] = []));
    setSchedule(initSchedule);
  }, []);

  const getDays = (start, end) => {
    const days = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  return (
    <div className="h-full  w-1/2 flex flex-col">
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
                <div className="text-center py-4 text-gray-400 text-xs border-2 border-dashed rounded-lg">
                  Drop activities here
                </div>
              ) : (
                <div className="space-y-2">
                  {schedule[day]?.map((item, i) => (
                    <Card key={i} className="shadow-none border">
                      <CardBody className="p-3">{item}</CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
