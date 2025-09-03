"use client";

import Select, { StylesConfig } from "react-select";

export default function CommunityReportsToolbar() {
  {/*const options = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
  ]; */}

  return (
    <div className="flex flex-wrap gap-4 flex-col sm:flex-row justify-between">
      <div className="px-8 flex flex-2 min-w-0 gap-3  rounded-full border border-[#E4E4E4] bg-white">
        <img width={15} src={"/community/search.svg"} alt="search" />
        <input
          className="flex-1 min-w-0 w-[140px] h-10  outline-none placeholder:text-[#BDBDBD]"
          placeholder="Search.."
        ></input>
      </div>

      <div className="flex-1 h-10">
        <Select
         
          styles={customStyles}
          onMenuOpen={() => console.log("Menu opened")}
          onMenuClose={() => console.log("Menu closed")}
          placeholder="Select"
          className="h-10"
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
    borderRadius: "9999px", 
    borderColor: "#E4E4E4",
    paddingLeft: "32px",
    paddingRight: "32px",
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
