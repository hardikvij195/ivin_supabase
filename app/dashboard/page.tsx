"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardCard from "@/app/dashboard/_components/dashboard-cards";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Skeleton } from "@/components/ui/skeleton"; // adjust path if different

const cardData = [
  {
    icon: "/dashboard/table-car.svg",
    title: "Total Car Reports Generated",
    value: 1856,
    linkText: "View Details",
  },
  {
    icon: "/dashboard/money-bag.svg",
    title: "Total Charges Till Now",
    value: "$256.00",
    linkText: "View Details",
  },
];

export default function Dashboard() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

      if (user) {
        const name =
          user.user_metadata?.full_name || user.user_metadata?.name || null;
        setFullName(name);
      }
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    // Full page skeleton
    return (
      <div className="flex flex-col gap-5 mt-5">
        <Skeleton className="h-7 w-48" />
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="w-[250px] h-[120px]" />
          <Skeleton className="w-[250px] h-[120px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 mt-4">
      <p className="font-fredoka font-semibold text-[24px] text-[#1C1C1C] px-2">
        Welcome, {fullName ? fullName : "Dealer"}
      </p>

      <div className="flex gap-2 flex-wrap">
        {cardData.map((card, index) => (
          <DashboardCard
            key={index}
            icon={
              <Image
                src={card.icon}
                alt={card.title}
                width={40}
                height={40}
              />
            }
            title={card.title}
            value={card.value}
            linkText={card.linkText}
          />
        ))}
      </div>
    </div>
  );
}
