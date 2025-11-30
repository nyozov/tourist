import { TripProvider } from "@/app/context/TripContext";
import Attractions from "./Attractions";
import Schedule from "./Schedule";

const page = () => {
  return (
    <TripProvider>
      <div className="w-full h-[calc(100vh-65px)] flex">
        <Schedule />
        <Attractions />
      </div>
    </TripProvider>
  );
};

export default page;
