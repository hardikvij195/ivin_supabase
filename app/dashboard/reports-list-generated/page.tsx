"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import GeneratedReportTable from "@/components/GeneratedReportTable";

type Json = Record<string, any>;

export interface CarfaxReport {
  status: string;
  method: string;
  id: string;
  user_id: string;
  created_at: string;
  vin: string | null;
  report_url: string | null;
  data: Json | null;
  report_id: string | null;
  json_url: string | null;
  original_pdf_url: string | null;
  vinx_pdf_url: string | null;
  amount?: number | string;
  report_type?: string;
}

export default function Page() {
  const [reports, setReports] = useState<CarfaxReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    let cancelled = false;

    async function fetchReports() {
      setLoading(true);
      setErr(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabaseBrowser.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("No user found. Please log in.");

        const { data, error } = await supabaseBrowser
          .from("carfax_reports")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!cancelled) setReports((data ?? []) as CarfaxReport[]);
      } catch (e: any) {
        console.error("Supabase fetch error:", e);
        if (!cancelled) {
          setReports([]);
          setErr(e?.message || "Failed to load reports.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReports();
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatus = (r: CarfaxReport) => {
    if (r.vinx_pdf_url || r.original_pdf_url || r.report_url)
      return "Completed";
    return "Pending";
  };

  const getPrice = (r: CarfaxReport) => {
    const raw = (r as any).amount;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string" && !Number.isNaN(Number(raw)))
      return Number(raw);

    const t =
      (r as any).report_type ||
      (r.data?.reportType as string) ||
      "Basic Report";
    if (t === "Full Report") return 14.99;
    if (t === "Dealer Pro Report") return 19.0;
    return 0.0;
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      const vinOk = q ? (r.vin || "").toLowerCase().includes(q) : true;
      const typeVal =
        (r as any).report_type || (r.data?.reportType as string) || "";
      const typeOk = reportType ? typeVal === reportType : true;

      const st = getStatus(r);
      const statusOk = status ? st === status : true;

      const dateOk = date
        ? (() => {
            const d1 = new Date(r.created_at);
            return (
              d1.getFullYear() === date.getFullYear() &&
              d1.getMonth() === date.getMonth() &&
              d1.getDate() === date.getDate()
            );
          })()
        : true;

      return vinOk && typeOk && statusOk && dateOk;
    });
  }, [reports, search, reportType, status, date]);

  const totalRecord = filtered.length;
  const totalPage = Math.max(1, Math.ceil(totalRecord / limit));
  const currentPage = Math.min(page, totalPage);
  const start = (currentPage - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return (
    <div className=" lg:max-w-screen md:max-w-screen max-w-[320px]">
      <p className="font-fredoka font-semibold text-[24px] mt-5 text-[#1C1C1C] mb-3 px-2"> Reports List</p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search.."
            className="h-10 w-full rounded-2xl sm:rounded-3xl bg-white pl-11 pr-4 border shadow-none
                       focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] placeholder:text-gray-400"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 w-full sm:w-48 justify-start rounded-2xl sm:rounded-3xl bg-white border border-gray-200 shadow-none
                         hover:bg-gray-100 text-[15px] px-4 sm:px-5"
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-purple-600" />
              {date ? format(date, "PP") : "Choose Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white"
            align="start"
            sideOffset={8}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setPage(1);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

    
      {err && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="overflow-x-auto rounded border border-gray-200 bg-white">
          <table className="min-w-[900px] w-full text-sm animate-pulse">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Image",
                  "VIN Number",
                  "Report Type",
                  "Date Generated",
                  "Status",
                  "Price",
                  "Action",
                ].map((h) => (
                  <th key={h} className="p-3 text-left text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="">
       
          <GeneratedReportTable
            items={paginated}
            loading={loading}
            page={currentPage}
            setPage={setPage}
            totalPage={totalPage}
            totalRecord={totalRecord}
            limit={limit}
            setLimit={(n) => {
              setLimit(n);
              setPage(1);
            }}
            getStatus={getStatus}
            getPrice={getPrice}
          />
        </div>
      )}
    </div>
  );
}
