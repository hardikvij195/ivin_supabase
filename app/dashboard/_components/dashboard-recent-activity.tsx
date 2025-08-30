import {Table} from "@/components/ui/table";
import Image from "next/image";

export default function DashboardRecentActivity() {
  return (
    <div className="px-6 py-5 flex flex-col gap-[12px] bg-white rounded-[8px] border border-[#EAEAEA]">
      <div className="flex justify-between">
        <div className="flex gap-[12] ">
          <Image src='/dashboard/recent.svg' alt="no image found" width={100} height={100}/>
          <p>Recent Activity</p>
        </div>
        <p className="text-primary font-semibold">view all</p>
      </div>
      <Table/>
    </div>
  );
}
