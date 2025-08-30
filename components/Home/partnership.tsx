export default function Partnership() {
  return (
    <div className="layout xl:px-20 px-8 xl:pt-32 pt-12">
      <div className="w-full flex flex-col justify-center items-center mb-10">
        <div className="mb-4 flex w-fit gap-[10px] px-4 py-2 text-primary border border-primary rounded-full ">
          <img src={"/home/partnership.svg"}></img>
          <p>Partnership</p>
        </div>

        <p className="text-[30px] lg:text-[40px] font-fredoka font-semibold text-center">
          <span className="text-primary">Trusted by </span> Leading Automotive
          Businesses
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5  gap-4">
      {Array.from({ length: 20 }).map((_, index) => (
    <div
      key={index}
      className="border border-[#EEDBFF] px-[22px] py-[12px] rounded-[8px]"
    >
      <img src="./home/brand.png" alt={`Brand ${index + 1}`} />
    </div>
  ))}
      </div>
    </div>
  );
}
