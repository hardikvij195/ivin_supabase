
  
  export default function BlogCard() {
    return (
      <div className="border border-primary rounded-[8px] p-6">
        <img className="mb-5" src={"/blog/thumbnail.png"} />
        <p className="text-primary mb-[12px]">Product Updates</p>
        <p className="font-bold text-[20px] mb-[12px] text-[#1C1C1C]">iVin Launches VIN Fraud Detection Technology</p>
        <p className="text-[#1C1C1C]">3 hours ago</p>
      </div>
    );
  }
  