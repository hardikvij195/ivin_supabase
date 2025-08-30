"use client";

import Select, { StylesConfig } from "react-select";

export default function CommunityReportsToolbar() {
  const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ];

  return (
    <div className="flex flex-wrap gap-4 flex-col sm:flex-row justify-between">
      <div className="px-8 py-4 flex flex-2 min-w-0 gap-5  rounded-full border border-[#E4E4E4]">
        <img width={24} src={"/community/search.svg"} alt="search" />
        <input
          className="flex-1 min-w-0 w-[140px] outline-none placeholder:text-[#BDBDBD]"
          placeholder="Search.."
        ></input>
      </div>

      <div className="flex-1">
        <Select
          options={options}
          styles={customStyles}
          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
          placeholder="Select"
        />
      </div>

      
    </div>
  );
}

type OptionType = {
  value: string;
  label: string;
};

const customStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    borderRadius: "9999px", // rounded-full
    borderColor: "#E4E4E4",
    paddingLeft: "32px", // px-32
    paddingRight: "32px",
    paddingTop: "10px", // py-16
    paddingBottom: "10px",
    fontSize: "18px",
    color: "#1C1C1C",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#1C1C1C",
    fontSize: "18px",
  }),
  input: (base) => ({
    ...base,
    color: "#1C1C1C",
    fontSize: "18px",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#1C1C1C",
    fontSize: "18px",
  }),
  option: (base) => ({
    ...base,
    color: "#1C1C1C",
    fontSize: "18px",
  }),
};
