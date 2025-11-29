import Attractions from "./Attractions";
import Schedule from "./Schedule";

const page = () => {
  return (
    <div className="w-full h-[calc(100vh-65px)] flex ">
      <Schedule />
      <Attractions />
    </div>
  );
};

export default page;
