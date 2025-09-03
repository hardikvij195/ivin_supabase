"use client"
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
        router.push(`/dashboard/generate-new-report`);
      } else {
        router.push("/dealer-login");
      }
    };
  

  return (
    <div className="layout flex flex-col md:flex-row items-center justify-between xl:px-20 px-8 xl:pt-16 pt-8 gap-8">
      <div className="flex-1 order-1 md:order-0 max-w-144">
        <p className="text-[30px] lg:text-[40px] font-semibold pb-6 font-fredoka ">
          Explore What’s Inside an <span className="text-primary">vinX</span>{" "}
          Report
        </p>
        <p className="text-[#4D4D4D] text-[16px] pb-2  mb-8">
          vinX offers more than just a basic vehicle history report, it's a
          comprehensive toolset that helps buyers, sellers, and dealers make
          smarter, safer, and more confident vehicle decisions.{" "}
        </p>
        <button className="px-10 py-5 font-fredoka bg-primary text-white font-semibold rounded-full w-max whitespace-nowrap cursor-pointer"
         onClick={handleGetReports}>
        Try Generate Report
        </button>
      </div>

      <div className="flex-1 flex justify-end">
        <img src={"/features/hero.svg"} />
      </div>
    </div>
  );
}
