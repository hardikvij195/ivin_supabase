export default function WhyItMatters() {
  return (
    <div className="layout flex justify-between  flex-col md:flex-row xl:px-20 px-8 xl:pt-16 pt-10  gap-10 md:gap-24">
      <div className="flex-1 max-w-150">
        <p className="text-[30px] lg:text-[40px]  font-semibold pb-6 font-fredoka ">
          Why It Matters
        </p>
        <p className="text-[#4D4D4D] text-[20px] pb-6">
          A clean report doesn’t just help you buy with confidence — it helps
          you sell with trust. iVin’s detailed vehicle history reports reduce
          risk, uncover hidden problems, and ensure you're making the most
          informed decision possible.
        </p>
        <p className="text-[24px] font-[#1C1C1C] font-semibold mb-4">Ready to Try iVin?</p>
        <p className="text-[18px] text-primary font-semibold mb-[12px]">Enter your 17-character VIN or Plate Number</p>
        <div className="w-full flex flex-col sm:flex-row justify-between gap-[12px] mb-8">
          <input
            className="bg-[#FAFAFA] text-[#999999] px-8 py-4 border border-[#E4E4E4]  rounded-full w-full"
            placeholder="e.g. 1HGCM82633A004352"
          ></input>
          <button className="px-10 py-5 font-fredoka bg-primary text-white font-semibold rounded-full w-max whitespace-nowrap">
            Get Reports
          </button>
        </div>
        
      </div>

      <div className="flex-1 flex justify-end">
        <img src={"/features/why-it-matters.svg"} />
      </div>
    </div>
  );
}
