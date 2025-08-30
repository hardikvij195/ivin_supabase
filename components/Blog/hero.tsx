export default function Hero() {
  return (
    <div className="layout flex flex-col md:flex-row justify-between items-center xl:px-20 px-8 xl:pt-16 pt-8 gap-8">
      <div className="flex-1 max-w-144">
        <p className="text-[30px] lg:text-[40px] font-semibold pb-6 font-fredoka ">
          Stay <span className="text-primary">Updated </span>
          with <span className="text-primary">iVin</span>
        </p>
        <p className="text-[#4D4D4D] text-[16px] pb-2  mb-8">
        Stay updated with the latest news, feature launches, and strategic partnerships from iVin. Discover how we're helping users and dealers make smarter vehicle decisions every day.
        </p>
        

        <div className="bg-[#F7EFFF] flex px-6 py-4 gap-[10px] border-l-primary border-l-4">
            <img src={"/blog/mail.svg"} alt="mail-icon" />
            <p>For media inquiries, please contact: <span className="underline text-primary">media@ivin.ca</span></p>
        </div>
      </div>

      <div className="flex-1 flex justify-end">
        <img src={"/blog/hero.svg"} />
      </div>
    </div>
  );
}
