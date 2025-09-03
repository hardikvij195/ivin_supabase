type Feature = {
  heading: string;
  image: string;
  items: string[];
};

const features: Feature[] = [
  {
    heading: "Damage & Accident History",
    image: "/home/damage.svg",
    items: [
      "Past accident records",
      "Structural or frame damage",
      "Hail or flood damage",
      "Location of impact",
      "Insurance claims & repair costs",
    ],
  },
  {
    heading: "Service & Safety Records",
    image: "/home/service.svg",
    items: [
      "Brake service",
      "Safety recall status",
      "Regular maintenance checks",
      "Oil changes",
      "Tire rotations",
    ],
  },
  {
    heading: "Ownership & Legal Status",
    image: "/home/ownership.svg",
    items: [
      "Lien checks (money owed)",
      "Theft records",
      "Odometer rollbacks",
      "Rebuild, salvage, or title issues",
      "Registration history",
    ],
  },
];

export default function Features() {
  return (
    <div className="layout xl:px-20 px-8 xl:pt-35 pt-16">
      <div className="w-full flex flex-col justify-center items-center mb-10">
        <div className="mb-4 flex w-fit gap-[10px] px-4 py-2 text-primary border border-primary rounded-full ">
          <img src={"/home/feature.svg"}></img>
          <p>Features</p>
        </div>

        <p className="text-[30px] lg:text-[40px] font-fredoka font-semibold text-center">
          What’s Inside an <span className="text-primary">vinX </span> Report?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {features.map((section, index) => (
          <div
            className="p-6 md:p-10 bg-primary-light border border-[#E4E4E4] rounded-[8px]"
            key={index}
          >
            <div className="flex flex-col justify-center items-center mb-[12px]">
              <img
                width={80}
                className="mb-[12px]"
                src={`${section.image}`}
              ></img>
              <p className="text-primary font-semibold">{section.heading}</p>
            </div>
            <ol className="list-disc list-inside space-y-2">
              {section.items.map((item, idx) => (
                <li className="text-[#1C1C1C]" key={idx}>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
