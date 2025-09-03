"use client";

import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser"; 
import { useState } from "react";

export default function Hero() {
  const router = useRouter();
  const [vin, setVin] = useState("");

  const handleGetReports = async () => {
    const {
      data: { user },
    } = await supabaseBrowser.auth.getUser();

    if (user) {
      // pass VIN as query param
      router.push(`/dashboard/generate-new-report?vin=${encodeURIComponent(vin)}`);
    } else {
      router.push("/dealer-login");
    }
  };

  // ✅ only enable button when VIN length = 17
  const isVinValid = vin.trim().length === 17;

  return (
    <div className="layout flex flex-col md:flex-row items-center justify-between xl:px-20 px-8 xl:pt-16 pt-8 gap-8">
      <div className="flex-1 order-1 md:order-0 max-w-144">
        <p className="text-[30px] lg:text-[40px] font-semibold pb-4 font-fredoka ">
          Smarter <span className="text-primary">Vehicle History</span> Reports
        </p>
        <p className="text-[#4D4D4D] text-[16px] pb-2">
          Your Trusted Source for Vehicle Insights
        </p>
        <p className="text-[#4D4D4D] text-[16px] pb-8">
          Buy with confidence. Sell with trust.
        </p>
        <p className="text-[18px] text-primary font-semibold mb-[12px]">
          Enter your 17-character VIN or Plate Number
        </p>
        <div className="w-full flex flex-col md:flex-row justify-between gap-[12px] mb-8">
          <input
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            maxLength={17} // ✅ prevent typing more than 17
            className="bg-[#FAFAFA] text-[#999999] px-8 py-4 border border-[#E4E4E4] rounded-full w-full"
            
          />
          <button
            onClick={handleGetReports}
            disabled={!isVinValid} // ✅ only enable when 17 characters
            className="px-10 py-4 sm:py-5 font-fredoka bg-primary text-white font-semibold rounded-full w-[100%] md:w-max whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Reports
          </button>
        </div>
        <div className="px-5 py-4 bg-primary-light rounded-[12px]">
          <p className="text-[#4D4D4D] text-[16px] mb-[12px]">
            Millions of reports generated. Billions of records searched.
          </p>
          <div className="flex gap-5">
            <div className="flex gap-2 items-start">
              <img src={"/home/check.svg"} className="mt-2" />
              <div>
                <p className="text-primary font-semibold text-[20px] sm:text-[24px]">
                  5M+
                </p>
                <p className="text-[#4D4D4D]">Reports Delivered</p>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <img src={"/home/check.svg"} className="mt-2" />
              <div>
                <p className="text-primary font-semibold text-[20px] sm:text-[24px]">
                  30B+
                </p>
                <p className="text-[#4D4D4D]">Verified Records Accessed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-end">
        <img src={"/home/car.svg"} />
      </div>
    </div>
  );
}
