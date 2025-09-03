export default function Story() {
  return (
    <div className="layout flex-col md:flex-row xl:px-20 px-8 xl:pt-4 pt-2 flex justify-between items-center gap-10 md:gap-20">
      <div className="flex flex-1 items-start">
        <img
          className="rounded-[12px] transform -translate-x-4 translate-y-4"
          src={"/about/story.svg"}
        />
      </div>

      <div className="flex-1">
        <p className="text-[30px] lg:text-[40px]  font-semibold font-fredoka mb-6">Our Story</p>
        <p className="text-[18px] mb-5">
          vinX was founded with a clear goal: to make vehicle information
          accessible, accurate, and easy to understand for everyday drivers,
          sellers, and dealers alike.
        </p>
        <p className="text-[18px] mb-5">
          Our journey began with a simple, powerful idea — help people make
          smarter car decisions using verified vehicle history. Since then,
          we've expanded our reach and improved our technology to offer not just
          history reports, but also tools like ownership checks, valuation
          insights, and service history. insights to help you assess safety,
          reliability, and future costs.
        </p>
        <p className="text-[18px]">
          Today, vinX offers a full suite of products designed to protect buyers
          and empower sellers — whether you're shopping for your first car,
          trading in, or running a dealership.
        </p>
      </div>
    </div>
  );
}
