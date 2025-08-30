"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  FileText,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Search,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// ✅ shadcn components
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Types
type AggregatedRow = {
  period: string;
  total_reports: number;
  top_report_type: string;
  total_charges: number;
};

export default function ReportsOverviewPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Collapsible toggles
  const [showMonthly, setShowMonthly] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // ✅ get logged in user
  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (data?.user) setUserId(data.user.id);
    });
  }, []);

  // ✅ fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      if (!userId) return;
      setLoading(true);

      let query = supabaseBrowser
        .from("carfax_reports")
        .select("created_at, report_type, amount, vin")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (dateRange?.from && dateRange?.to) {
        query = query
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error("❌ Error fetching reports:", error);
        setReports([]);
      } else {
        setReports(data || []);
      }
      setLoading(false);
    };

    fetchReports();
  }, [userId, dateRange]);

  // ✅ search filter applied locally
  const filteredReports = useMemo(() => {
    if (!search) return reports;
    const q = search.toLowerCase();
    return reports.filter(
      (r) =>
        r.vin?.toLowerCase().includes(q) ||
        r.report_type?.toLowerCase().includes(q) ||
        r.created_at.toLowerCase().includes(q)
    );
  }, [reports, search]);

  // ✅ aggregate monthly
  const monthlyData: AggregatedRow[] = useMemo(() => {
    const grouped: Record<string, { count: number; charges: number; typeCount: Record<string, number> }> = {};
    filteredReports.forEach((r) => {
      const d = new Date(r.created_at);
      const key = `${d.toLocaleString("default", { month: "short" })}, ${d.getFullYear()}`;
      if (!grouped[key]) grouped[key] = { count: 0, charges: 0, typeCount: {} };
      grouped[key].count++;
      grouped[key].charges += Number(r.amount || 0);
      grouped[key].typeCount[r.report_type || "Unknown"] =
        (grouped[key].typeCount[r.report_type || "Unknown"] || 0) + 1;
    });
    return Object.entries(grouped).map(([period, values]) => {
      const topType = Object.entries(values.typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
      return { period, total_reports: values.count, top_report_type: topType, total_charges: values.charges };
    });
  }, [filteredReports]);

  // ✅ aggregate weekly
  const weeklyData: AggregatedRow[] = useMemo(() => {
    const grouped: Record<string, { count: number; charges: number; typeCount: Record<string, number> }> = {};
    function getWeekRange(date: Date): string {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(d.setDate(diff));
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const fmt = (dt: Date) => `${dt.toLocaleString("default", { month: "short" })} ${dt.getDate()}`;
      return `${fmt(start)}–${fmt(end)}, ${start.getFullYear()}`;
    }
    filteredReports.forEach((r) => {
      const d = new Date(r.created_at);
      const key = getWeekRange(d);
      if (!grouped[key]) grouped[key] = { count: 0, charges: 0, typeCount: {} };
      grouped[key].count++;
      grouped[key].charges += Number(r.amount || 0);
      grouped[key].typeCount[r.report_type || "Unknown"] =
        (grouped[key].typeCount[r.report_type || "Unknown"] || 0) + 1;
    });
    return Object.entries(grouped).map(([period, values]) => {
      const topType = Object.entries(values.typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
      return { period, total_reports: values.count, top_report_type: topType, total_charges: values.charges };
    });
  }, [filteredReports]);

  // ✅ reusable collapsible table
  const CollapsibleTable = ({ title, rows, open, toggle }: { title: string; rows: AggregatedRow[]; open: boolean; toggle: () => void }) => (
    <div className="mb-4">
      {/* Header Row */}
      <div
        onClick={toggle}
        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-purple-100"
      >
        <div className="flex items-center gap-2 font-medium text-gray-800">
          {title === "Monthly Reports" ? <FileText className="w-5 h-5 text-purple-700" /> : <CalendarDays className="w-5 h-5 text-purple-700" />}
          {title}
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
      </div>

      {/* Table */}
      {open && (
        <div className="overflow-x-auto rounded border border-gray-200 bg-white mt-2">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="p-3 text-left">Period</th>
                <th className="p-3 text-left">Total Reports</th>
                <th className="p-3 text-left">Top Report Type</th>
                <th className="p-3 text-left">Total Charges</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-3">{row.period}</td>
                    <td className="p-3">{row.total_reports}</td>
                    <td className="p-3">{row.top_report_type}</td>
                    <td className="p-3">${row.total_charges.toFixed(2)}</td>
                    <td className="p-3 space-x-3 whitespace-nowrap">
                      <a href="#" className="text-blue-600 inline-flex items-center gap-1 hover:underline">
                        <FileText className="w-4 h-4" />
                        PDF
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Reports Overview</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Full-width Search */}
        <div className="relative flex-1">
          <Input
            placeholder="Search VIN / Type / Date"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-3xl bg-white h-10 w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 lg:w-40 md:w-40 w-80 justify-start rounded-2xl sm:rounded-3xl bg-white border border-gray-200 shadow-none hover:bg-gray-100 text-[15px] px-4 sm:px-5"
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-purple-600" />
              Select Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start" sideOffset={8}>
            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      {/* Collapsible Tables */}
      <CollapsibleTable title="Weekly Reports" rows={weeklyData} open={showWeekly} toggle={() => setShowWeekly(!showWeekly)} />
      <CollapsibleTable title="Monthly Reports" rows={monthlyData} open={showMonthly} toggle={() => setShowMonthly(!showMonthly)} />
      
    </div>
  );
}
