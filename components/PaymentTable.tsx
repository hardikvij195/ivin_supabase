"use client";

import React, { Dispatch, SetStateAction } from "react";
import type { CarfaxReport } from "@/app/dashboard/reports-list-generated/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { FileText } from "lucide-react";
import PaginationBar from "./ui/pagination";

type Props = {
  items: CarfaxReport[];
  loading: boolean;

  // use React dispatcher types to match PaginationBar expectations
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  totalRecord: number;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;

  getStatus?: (r: CarfaxReport) => "Pending" | "Completed" | "Failed" | string;
  getPrice?: (r: CarfaxReport) => number;
};

const defaultGetStatus = (r: CarfaxReport) => {
  if (r.vinx_pdf_url || r.original_pdf_url || r.report_url) return "Completed";
  return "Pending";
};

const defaultGetPrice = (r: CarfaxReport) => {
  const hasAmount =
    typeof (r as any).amount === "number" ||
    typeof (r as any).amount === "string";
  if (hasAmount) {
    const num = Number((r as any).amount);
    if (!Number.isNaN(num)) return num;
  }
  const typeStr =
    (r as any).report_type || (r.data?.reportType as string) || "Basic Report";
  if (typeStr === "Full Report") return 14.99;
  if (typeStr === "Dealer Pro Report") return 19.0;
  return 0.0;
};

const GeneratedReportTable: React.FC<Props> = ({
  items,
  loading,

  page,
  setPage,
  totalPage,
  totalRecord,
  limit,
  setLimit,

  getStatus = defaultGetStatus,
  getPrice = defaultGetPrice,
}) => {
  return (
    <div>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <Table className="min-w-[900px] w-full text-sm">
          <TableHeader className="bg-gray-50">
            <TableRow className="text-left text-gray-700">
              <TableHead className="p-3">Date </TableHead>
              <TableHead className="p-3">Report Type</TableHead>

              <TableHead className="p-3">VIN Number</TableHead>
              <TableHead className="p-3">Price</TableHead>
              <TableHead className="p-3">Payment Method</TableHead>

              <TableHead className="p-3">Status</TableHead>

              <TableHead className="p-3">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-6 text-center text-gray-500"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="p-6 text-center text-gray-500"
                >
                  No reports found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((r) => {
                const rType =
                  (r as any).report_type ||
                  (r.data?.reportType as string) ||
                  "—";
                const st = getStatus(r);
                const priceNum = Number(getPrice(r));
                const priceSafe = Number.isFinite(priceNum) ? priceNum : 0;

                const carfaxUrl = r.original_pdf_url || r.report_url || "#";
                const vinxUrl =
                  r.vinx_pdf_url ||
                  (r.report_id
                    ? `/report?id=${encodeURIComponent(r.report_id)}`
                    : "");
                const jsonUrl =
                  r.json_url ||
                  (r.report_id
                    ? `/api/proxyCarfaxJson?id=${encodeURIComponent(
                        r.report_id
                      )}`
                    : "");

                return (
                  <TableRow key={r.user_id} className="border-t hover:bg-gray-50">
                     <TableCell className="p-3">
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                     <TableCell className="p-3">{rType}</TableCell>

                    <TableCell className="p-3 font-mono">
                      {r.vin || "—"}
                    </TableCell>
                    <TableCell className="p-3">
                      ${priceSafe.toFixed(2)}
                    </TableCell>
                    <TableCell className="p-3 font-mono">
                      {r.method || "—"}
                    </TableCell>
                     <TableCell className="p-3">
                     {r.status || "-"}
                    </TableCell>
                    <TableCell className="p-3 space-x-4 whitespace-nowrap">
                      {vinxUrl && (
                        <a
                          href={vinxUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 inline-flex items-center gap-2 hover:underline"
                        >
                          <FileText />
                          <span>View PDF</span>
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <PaginationBar page={page} setPage={setPage} totalPage={totalPage} />
      </div>
    </div>
  );
};

export default GeneratedReportTable;
