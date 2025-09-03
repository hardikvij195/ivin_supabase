"use client"
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser"; 
import { useState } from "react";

export default function Ownership() {

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
      <div
        className="layout flex-col md:flex-row xl:px-20 px-8 xl:pt-27 pt-20 flex items-center justify-between  gap-10 md:gap-20"
      >
        <div className="flex-1 order-1 md:order-0 ">
          <p className="text-[30px] lg:text-[40px] font-semibold font-fredoka mb-4 md:mb-8 ">
          Ownership & Legal Status
          </p>
          <p className="text-[18px] mb-[12px] text-primary font-semibold">
          Protect yourself from legal and financial surprises.
          </p>
          <p className="text-[18px] mb-5">
          Understand the true legal standing of the vehicle before you buy. This section of the vinX report helps verify whether the vehicle has a clean title and if there are any hidden issues that could affect ownership.
          </p>
          <p className="text-[18px] font-semibold mb-[12px]">Includues:</p>
          <ol className="list-disc list-inside space-y-2 text-[18px] mb-8">
            <li>Lien status (money owed on the vehicle)</li>
            <li>Stolen vehicle reports</li>
            <li>Odometer inconsistencies (rollbacks)</li>
            <li>Salvage, rebuilt, or branded title status</li>
            
          </ol>
          <button className="text-[18px] sm:text-[20px] font-semibold font-fredoka px-5 sm:px-10 py-3 sm:py-5 bg-primary text-white rounded-full cursor-pointer" onClick={handleGetReports}>
          Verify Ownership & Title
          </button>
        </div>
  
        <div className="rounded-[12px] flex-1 ml-10 md:ml-auto border-primary border-2 bg-[#DFC3EE] h-fit transform -translate-x-4 -translate-y-4">
          <img
            className="rounded-[12px] transform -translate-x-4 translate-y-4"
            src={"/features/ownership.png"}
          />
        </div>
      </div>
    );
  }