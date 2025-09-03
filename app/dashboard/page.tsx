"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardCard from "@/app/dashboard/_components/dashboard-cards";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [totalCharges, setTotalCharges] = useState<number>(0);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabaseBrowser.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const name =
          user.user_metadata?.full_name || user.user_metadata?.name || null;
        setFullName(name);

        const { count, error: countError } = await supabaseBrowser
          .from("carfax_reports")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (countError) {
          console.error("Error fetching total reports:", countError);
        } else {
          setTotalReports(count ?? 0);
        }


        const { data: reports, error: sumError } = await supabaseBrowser
          .from("carfax_reports")
          .select("amount")
          .eq("user_id", user.id);

        if (sumError) {
          console.error("Error fetching charges:", sumError);
        } else {
          const total = (reports ?? []).reduce(
            (acc, r) => acc + (parseFloat(r.amount) || 0),
            0
          );
          setTotalCharges(total);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  if (loading) {
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

  const cardData = [
    {
      icon: "/dashboard/table-car.svg",
      title: "Total Car Reports Generated",
      value: totalReports,
      linkText: "View Details",
      linkHref: "/dashboard/reports-list-generated", 
    },
    {
      icon: "/dashboard/money-bag.svg",
      title: "Total Charges Till Now",
      value: `$${totalCharges.toFixed(2)}`,
      linkText: "View Details",
       linkHref: "/dashboard/payments",
    },
  ];

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
             linkHref={card.linkHref}
            
          />
          
        ))}
        
      </div>
    </div>
  );
}
