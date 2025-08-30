export default function Damage() {
    return (
      <div
        className="layout flex-col md:flex-row xl:px-20 px-8 xl:pt-27 pt-20 flex justify-between items-center gap-10 md:gap-20"
      >
        <div className="flex-1 order-1 md:order-0 ">
          <p className="text-[30px] lg:text-[40px] font-semibold font-fredoka mb-4 xl:mb-8">
            Damage & Accident History
          </p>
          <p className="text-[18px] mb-[12px] text-primary font-semibold">
            Understand the true condition of a vehicle beyond the surface.
          </p>
          <p className="text-[18px] mb-5">
            This section of the us report provides a deep dive into any incidents
            or damage the vehicle may have sustained in the past. Each element
            below offers specific insights to help you assess safety, reliability,
            and future costs.
          </p>
          <p className="text-[18px] font-semibold mb-[12px]">Includues:</p>
          <ol className="list-disc list-inside space-y-2 text-[18px] mb-8">
            <li>Reported accident history</li>
            <li>Structural or frame damage</li>
            <li>Hail or flood damage</li>
            <li>Location and severity of impact</li>
            <li>Insurance claims & repair estimates</li>
          </ol>
          <button className="text-[18px] sm:text-[20px] font-semibold font-fredoka px-5 sm:px-10 py-3 sm:py-5 bg-primary text-white rounded-full">
            Check for Past Damage
          </button>
        </div>
  
        <div className="rounded-[12px] flex-1 ml-10 md:ml-auto border-primary border-2 bg-[#DFC3EE] h-fit transform -translate-x-4 -translate-y-4">
          <img
            className="rounded-[12px] transform -translate-x-4 translate-y-4"
            src={"/features/damage.jpg"}
          />
        </div>
      </div>
    );
  }