"use client"
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser"; 
import { useState } from "react";

export default function Service() {
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
        className=" bg-primary-light mt-15 xl:mt-18"
      >
        <div className="layout flex-col md:flex-row xl:px-20 px-10 xl:py-20 py-10 flex items-center justify-between  gap-10 md:gap-20">
        <div className="rounded-[12px] flex-1 mr-10 md:mr-auto border-primary border-2 bg-[#DFC3EE] h-fit transform -translate-x-4 -translate-y-4">
          <img
            className="rounded-[12px] transform translate-x-4 translate-y-4"
            src={"/features/service.png"}
          />
        </div>
        <div className="flex-1">
          <p className="text-[30px] lg:text-[40px] font-semibold font-fredoka mb-4 md:mb-8">
          Service & Safety Records
          </p>
          <p className="text-[18px] mb-[12px] text-primary font-semibold">
          Verified maintenance and safety records.
          </p>
          <p className="text-[18px] mb-5">
          A well-maintained vehicle not only runs better but also holds its value longer. vinX compiles service and safety data from verified sources such as authorized repair shops, dealership service centers, and manufacturer databases, so you know exactly how the car has been treated.
          </p>
          <p className="text-[18px] font-semibold mb-[12px]">Includues:</p>
          <ol className="list-disc list-inside space-y-2 text-[18px] mb-8">
            <li>Oil changes, brake jobs, tire rotations</li>
            <li>Open safety recalls from manufacturers</li>
            <li>History of regular maintenance checks</li>
          </ol>
          <button className="text-[18px] sm:text-[20px] font-semibold font-fredoka px-5 sm:px-10 py-3 sm:py-5 bg-primary text-white rounded-full cursor-pointer" onClick={handleGetReports}>
          View Service History
          </button>
        </div>
        </div>
      </div>
    );
  }