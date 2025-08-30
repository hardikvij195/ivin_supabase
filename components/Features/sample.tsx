export default function Sample() {
    return (
      <div
     
        className="bg-[url('/features/sample.png')] bg-cover bg-center text-white h-110 font-fredoka flex flex-col items-center justify-center mt-15 xl:mt-18"
      >
        <p className="text-[30px] lg:text-[40px] font-semibold font-fredoka mb-3">
          View a Sample
        </p>
        <p className="text-[20px] text-center px-5 text-[#F8F0FF] mb-10">
          Curious about the full report format? See what you’ll get before you
          buy.
        </p>
        <button className="text-[20px] border border-white font-semibold font-fredoka px-10 py-4 bg-[#FFFFFF1A] text-white rounded-full">
          View Sample Report
        </button>
      </div>
    );
  }