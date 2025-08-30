type Banner = {
    heading: string
}

export default function Banner({heading}: Banner) {
  return (
    <div className="bg-[url('/shared/banner.png')] font-fredoka font-semibold text-[30px] lg:text-[40px] text-center bg-cover bg-center text-white flex items-center justify-center h-53">
       <p>{heading}</p>
    </div>
  );
}
