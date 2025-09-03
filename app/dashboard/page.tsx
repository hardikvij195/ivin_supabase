"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import DashboardCard from "@/app/dashboard/_components/dashboard-cards";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Wallet, Search, Calendar as CalendarIcon, ArrowRight } from "lucide-react";

export interface CarfaxReport {
  id: string;
  created_at: string;
  vin: string | null;
  report_url: string | null;
  data: JSON | null;
  report_id: string | null;
  json_url: string | null;
  original_pdf_url: string | null;
  vinx_pdf_url: string | null;
  amount?: number | string;
  report_type?: string;
  method: string;
  status: string;
  user_id: string;
}


type WalletRow = {
  user_id: string;
  balance: number | string | null;
  updated_at?: string | null;
};


export default function Dashboard() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [totalCharges, setTotalCharges] = useState<number>(0);
   const [reports, setReports] = useState<CarfaxReport[]>([]);
    const [err, setErr] = useState<string | null>(null);
    const [date, setDate] = useState<Date | undefined>(undefined);
  
    const [search, setSearch] = useState("");
    const [reportType, setReportType] = useState("");
    const [status, setStatus] = useState("");
  
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
  
    // wallet summary
    const [walletLoading, setWalletLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState<number>(0);



  useEffect(() => {
      let cancelled = false;
  
      async function fetchAll() {
        setLoading(true);
        setWalletLoading(true);
        setErr(null);
        try {
          const {
            data: { user },
            error: userError,
          } = await supabaseBrowser.auth.getUser();
          if (userError) throw userError;
          if (!user) throw new Error("No user found. Please log in.");
  
          const { data, error } = await supabaseBrowser
            .from("payments")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
  
          if (error) throw error;
          if (!cancelled) setReports((data ?? []) as CarfaxReport[]);
  
          const { data: w, error: wErr } = await supabaseBrowser
            .from("wallets")
            .select("balance")
            .eq("user_id", user.id)
            .single();
  
          if (!cancelled) {
            const raw = (w as WalletRow | null)?.balance ?? 0;
            setWalletBalance(Number(raw) || 0);
          }
          if (wErr && wErr.code !== "PGRST116") {
            console.warn("Wallet fetch warn:", wErr.message);
          }
        } catch (e: any) {
          console.error("Supabase fetch error:", e);
          if (!cancelled) {
            setReports([]);
            setErr(e?.message || "Failed to load payments.");
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
            setWalletLoading(false);
          }
        }
      }
  
      fetchAll();
      return () => {
        cancelled = true;
      };
    }, []);

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
      <Link href="/dashboard/payments/wallet" className="group block mb-3">
        <div className="gap-3 sm:gap-0 w-80 rounded-xl border border-gray-200 bg-white px-4 sm:px-5 py-4 hover:shadow transition">
          <div className="flex items-center gap-3 h-40">
            <div className="rounded-lg bg-purple-600/10 p-2">
              <Wallet className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Wallet Balance</div>
              <div className="text-xl font-semibold text-gray-900">
                {walletLoading ? "…" : `$${walletBalance.toFixed(2)}`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-700 font-medium">
            Manage wallet
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </div>
  );
}
