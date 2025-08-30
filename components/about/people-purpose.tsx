export default function PeoplePurpose() {
    return (
      <div className="layout xl:px-20 px-8 xl:pt-16 pt-8 gap-20">
       <p className="font-fredoka text-[32px] text-center font-semibold mb-10" >People and Purpose</p>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <PeoplePurposeCard/>
        <PeoplePurposeCard/>
        <PeoplePurposeCard/>
        <PeoplePurposeCard/>
        <PeoplePurposeCard/>
        <PeoplePurposeCard/>
        <PeoplePurposeCard/>
        <PeoplePurposeCard/>
       </div>
      </div>
    );
  }
  


 function PeoplePurposeCard() {
    return (
        <div className=" flex flex-col items-center border border-primary p-6">
        <img className="max-w-30 mb-4" src={"/blog/thumbnail.png"} />
        <p className=" font-bold text-[20px] mb-2">Company Name 1</p>
        <p className="text-center text-[18px] mb-4 text-[#1C1C1C]">Innovating for a Sustainable Future</p>
        <p className="text-center text-[#4D4D4D]">Leader in eco-friendly technology, helping us develop sustainable solutions that reduce our carbon footprint and maximize energy efficiency.</p>
      </div>
    );
  }
  