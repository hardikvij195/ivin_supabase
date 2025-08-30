export default function Hero() {
  return (
    <div className="layout flex flex-col md:flex-row justify-between items-center   xl:pl-20 pl-10  xl:pr-0 pr-10   xl:pt-16 pt-8 gap-8">
      <div className="flex-1 order-1 md:order-0 max-w-144">
        <p className="text-[30px] lg:text-[40px] font-semibold pb-6 font-fredoka ">
          About <span className="text-primary">iVin</span>
        </p>
        <p className="text-[#4D4D4D] text-[16px] pb-2  mb-8">
          At iVin, we believe buying or selling a car should be a confident,
          transparent experience. That’s why we’ve developed tools and reports
          backed by billions of data points from verified sources across the
          automotive ecosystem.
        </p>
      </div>

      <div className="flex-1 flex justify-end">
        <img src={"/about/hero.svg"} />
      </div>
    </div>
  );
}
