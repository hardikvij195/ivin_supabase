"use client";

import { useEffect, useState, useMemo } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Types
type CarfaxReport = {
  id: string;
  created_at: string;
  vin: string | null;
  data: any | null;
  report_type: string | null;
  user_id: string | null; 
  add_wall: boolean | null;
};

// Skeleton loader
function ReportSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
      <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-1/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-1/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-8 w-full bg-gray-200 rounded mt-4"></div>
    </div>
  );
}

export default function DealerWallPage() {
  const [reports, setReports] = useState<CarfaxReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load current user + reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);

      // 1. Get logged-in dealer
      const {
        data: { user },
        error: userErr,
      } = await supabaseBrowser.auth.getUser();

      if (userErr) {
        console.error("❌ Auth error:", userErr);
        setLoading(false);
        return;
      }
      if (!user) {
        console.warn("⚠️ No logged in user.");
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      // 2. Fetch only that dealer’s reports where add_wall = true
      const { data, error } = await supabaseBrowser
        .from("carfax_reports")
        .select("*")
        .eq("user_id", user.id)
        .eq("add_wall", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching dealer wall reports:", error);
        setReports([]);
      } else {
        console.log("✅ Dealer reports fetched:", data);
        setReports(data || []);
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  const filtered = useMemo(
    () =>
      reports.filter((r) =>
        (r.vin || "").toLowerCase().includes(search.toLowerCase())
      ),
    [reports, search]
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
     
        <p className="font-fredoka font-semibold text-[24px] mt-5 text-[#1C1C1C] mb-3 px-2"> The Wall</p>
  

      {/* Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3 shrink-0 sticky top-[56px] z-10 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by VIN..."
            className="pl-10 rounded-3xl bg-white"
          />
        </div>
      </div>

      {/* Reports grid */}
      <div className="flex-1 overflow-y-auto lg:pb-[12%] md:pb-[12%] pb-[30%]">
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ReportSkeleton key={i} />)
            : filtered.length === 0
            ? (
              <p className="text-gray-500 col-span-full text-center">
                No shared reports found.
              </p>
            )
            : filtered.map((report) => {
                const vehicle = report.data?.VehicleDetailsViewModel || {};
                const make = vehicle.VehicleMake || "Unknown";
                const model = vehicle.VehicleModel || "";
                const year = vehicle.VehicleYear || "";
                const vehicleLabel = `${year} ${make} ${model}`;
                const generatedAgo = formatDistanceToNow(
                  new Date(report.created_at),
                  { addSuffix: true }
                );

                return (
                  <div
                    key={report.id}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between"
                  >
                    {/* Top info */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-sm font-semibold text-purple-700 uppercase">
                          {vehicleLabel}
                        </h2>
                        <span className="text-xs text-gray-500">
                          {generatedAgo}
                        </span>
                      </div>

                      <p className="text-sm font-mono tracking-wide mb-2">
                        {report.vin?.slice(0, 3) +
                          "************" +
                          report.vin?.slice(-3)}
                      </p>

                      <div className="mt-3 text-sm text-gray-600 space-y-0.5">
                        <p>Make: {make}</p>
                        <p>Model: {model}</p>
                        <p>Year: {year}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
