export default function WhyChooseUs() {
  return (
    <div className="layout  xl:px-20 px-8 xl:pt-18 pt-12">
      <div className="w-full flex flex-col justify-center items-start mb-8">
        <div className="mb-4 flex w-fit gap-[10px] px-4 py-2 text-primary border border-primary rounded-full ">
          <img src={"/home/tick.svg"}></img>
          <p>Value</p>
        </div>

        <p className="text-[30px] lg:text-[40px] font-fredoka font-semibold text-center">
          Why Choose <span className="text-primary">vinX? </span>
        </p>
      </div>


      <div className="layout flex flex-col md:flex-row justify-between gap-4 sm:gap-8">
        <div className="flex order-1 md:order-0 flex-1 flex-col gap-10 max-w-[520px]">
            <div>
            <ol className="list-disc list-inside">
                <li className="text-primary font-semibold text-[24px] mb-[12px]">Nationwide Vehicle Data Network</li>
            </ol>
           <p className="font-[#1C1C1C]">We pull real-time records from thousands of verified databases including insurers, government registries, repair shops, and auctions.</p>
           </div>

           <div>
            <ol className="list-disc list-inside">
                <li className="text-primary font-semibold text-[24px] mb-[12px]">History-Based Valuation</li>
            </ol>
           <p className="font-[#1C1C1C]">Only vinX uses full historical data to offer accurate, personalized value assessments.</p>
           </div>

           <div>
            <ol className="list-disc list-inside">
                <li className="text-primary font-semibold text-[24px] mb-[12px]">Trusted by Dealers Across the Network</li>
            </ol>
           <p className="font-[#1C1C1C]">From independent sellers to franchise dealerships, vinX is the go-to platform for fast, reliable, and trustworthy vehicle background checks.</p>
           </div>
        </div>
        <div className="flex-1  flex justify-end">
        <img src="/home/why-choose.svg" alt="why-choose-us"/ >
        </div>
      </div>
    </div>
  );
}
