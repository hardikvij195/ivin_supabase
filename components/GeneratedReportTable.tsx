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
    <div className=" bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full border-spacing-0">
          <TableHeader className="bg-gray-50">
            <TableRow className="text-left text-gray-700">
              <TableHead className="text-left py-1 lg:px-4 md:px-4 px-3 font-medium text-gray-500 text-xs">VIN NUMBER</TableHead>
              <TableHead className="text-left py-1 lg:px-4 md:px-4 px-3 font-medium text-gray-500 text-xs">REPORT TYPE</TableHead>
              <TableHead className="text-left py-1 lg:px-4 md:px-4 px-3 font-medium text-gray-500 text-xs">DATE GENERATED</TableHead>
              <TableHead className="text-left py-1 lg:px-4 md:px-4 px-3 font-medium text-gray-500 text-xs">STATUS</TableHead>
              <TableHead className="text-left py-1 lg:px-4 md:px-4 px-3 font-medium text-gray-500 text-xs">PRICE</TableHead>
              <TableHead className="text-left py-1 lg:px-4 md:px-4 px-3 font-medium text-gray-500 text-xs">ACTION</TableHead>
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
                  <TableRow key={r.id} className="border-b border-gray-100 hover:bg-purple-50 transition-colors lg:text-md md:text-md text-sm">
                    <TableCell className="py-4 px-4 text-gray-900">
                      {r.vin || "—"}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-900">{rType}</TableCell>
                    <TableCell className="py-4 px-4 text-gray-900">
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-900">
                      {st === "Pending" && (
                        <span className="text-yellow-700">⚠ Pending</span>
                      )}
                      {st === "Completed" && (
                        <span className="text-green-700">● Completed</span>
                      )}
                      {st === "Failed" && (
                        <span className="text-red-700">✖ Failed</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-900">
                      ${priceSafe.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-gray-900">
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
