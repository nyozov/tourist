import Attractions from "./Attractions";
import Schedule from "./Schedule";

const page = () => {
  return (
    <div className="w-full flex">
      <Schedule />
      <Attractions />
    </div>
  );
};

export default page;
