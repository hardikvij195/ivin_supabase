type VehicleTool = {
  title: string;
  description: string;
  actionText: string;
  image: string;
};

const vehicleTools: VehicleTool[] = [
  {
    title: "Vehicle Value Estimator",
    description: "Get a value range based on similar vehicles sold nearby.",
    actionText: "Get Value Range",
    image: "/home/value.svg",
  },
  {
    title: "VIN Decoder",
    description: "Identify your car's model, make, year, origin, and more.",
    actionText: "Decode a VIN",
    image: "/home/vin.svg",
  },
  {
    title: "Recall Checker",
    description: "Instantly check if a vehicle has unresolved safety recalls.",
    actionText: "Check Recall Status",
    image: "/home/checker.svg",
  },
];

export default function Tools() {
  return (
    <div className="bg-primary mt-12 md:mt-16">
      <div className="layout  xl:px-20 px-8 xl:py-18 py-8">
        <div className="w-full flex flex-col justify-center items-center pb-10">
          <div className="mb-4 flex w-fit gap-[10px] px-4 py-2 text-white border border-white rounded-full">
            <img src={"/home/tools.svg"} alt="Tools" />
            <p>Tools</p>
          </div>

          <p className="text-[30px] lg:text-[40px] font-fredoka font-semibold text-center text-white">
            Free Tools for Smarter Car Decisions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {vehicleTools.map((vehicleTool, i) => {
            return (
              <div  key={i} className="text-white flex flex-col items-center">
                <img className="mb-[12px] w-15 sm:w-20" src={vehicleTool.image}></img>
                <p className="font-semibold text-[20px] text-center text-white mb-4"> {vehicleTool.title}</p>
                <div className="w-18 h-1 mb-[12px] bg-white"></div>
                <p className="max-w-68 text-[18px] mb-8 text-center">{vehicleTool.description}</p>
                {/*<button className="font-semibold font-fredoka border border-white px-6 sm:px-10 py-2 sm:py-4 rounded-full">{vehicleTool.actionText}</button>*/}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
