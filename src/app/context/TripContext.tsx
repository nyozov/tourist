"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Activity {
  instanceId: string; // unique id in case a user adds the same activity multiple times
  id: string;
  name: string;
  [key: string]: any;
}

interface TripContextType {
  days: string[];
  schedule: Record<string, Activity[]>;
  addActivityToDay: (day: string, activity: Activity) => void;
  removeActivityFromDay: (day: string, instanceId: string) => void;
  moveActivityBetweenDays: (
    fromDay: string,
    toDay: string,
    instanceId: string
  ) => void;
  isLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

// To differentiate created activity cards with different background colors
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

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [days, setDays] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<string, Activity[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const start = params.get("start");
    const end = params.get("end");

    if (start && end) {
      const daysList = getDays(start, end);
      setDays(daysList);

      const initSchedule: Record<string, Activity[]> = {};
      daysList.forEach((day) => (initSchedule[day] = []));
      setSchedule(initSchedule);
    }

    setIsLoading(false);
  }, []);

  const getDays = (start: string, end: string): string[] => {
    const days: string[] = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const addActivityToDay = (day: string, activity: Activity) => {
    // Generate unique instance ID
    const instanceId = crypto.randomUUID();

    const activityWithInstance: Activity = {
      ...activity,
      instanceId,
      backgroundColor: gradients[Math.floor(Math.random() * gradients.length)],
    };

    setSchedule((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), activityWithInstance],
    }));
  };

  const removeActivityFromDay = (day: string, instanceId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]:
        prev[day]?.filter((activity) => activity.instanceId !== instanceId) ||
        [],
    }));
  };

  const moveActivityBetweenDays = (
    fromDay: string,
    toDay: string,
    instanceId: string
  ) => {
    setSchedule((prev) => {
      const activity = prev[fromDay]?.find((a) => a.instanceId === instanceId);
      if (!activity) return prev;

      return {
        ...prev,
        [fromDay]: prev[fromDay].filter((a) => a.instanceId !== instanceId),
        [toDay]: [...(prev[toDay] || []), activity],
      };
    });
  };

  return (
    <TripContext.Provider
      value={{
        days,
        schedule,
        addActivityToDay,
        removeActivityFromDay,
        moveActivityBetweenDays,
        isLoading,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within TripProvider");
  }
  return context;
};
