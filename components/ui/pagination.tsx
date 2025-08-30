"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  totalPage: number;                 
  page: number;                    
  setPage: (p: number) => void;      
  windowSize?: number;             
  className?: string;
};

export default function PaginationBar({
  totalPage,
  page,
  setPage,
  windowSize = 4,
  className = "",
}: Props) {
  const tp = Math.max(1, totalPage);
  const current = Math.min(Math.max(1, page), tp);

  const maxStart = Math.max(1, tp - windowSize + 1);
  const start = Math.min(Math.max(1, current - windowSize + 1), maxStart);
  const end = Math.min(tp, start + windowSize - 1);

  const pages = React.useMemo(
    () => Array.from({ length: end - start + 1 }, (_, i) => start + i),
    [start, end]
  );

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), tp));

  if (tp <= 1) {
    return (
      <div className={`w-full flex justify-end px-4 py-3 ${className}`}>
        <div className="flex items-center gap-2">
          <button
            disabled
            className="w-8 h-8 flex items-center justify-center rounded-lg opacity-40 cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            className="w-8 h-8 rounded-lg border bg-purple-700 text-white border-transparent"
            aria-current="page"
            aria-label="Page 1"
          >
            1
          </button>
          <button
            disabled
            className="w-8 h-8 flex items-center justify-center rounded-lg opacity-40 cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </div>
      </div>
    );
  }

  const atStart = current === 1;
  const atEnd = current === tp;

  return (
    <div className={`w-full flex justify-end px-4 py-3 ${className}`}>
      <div className="flex items-center gap-2">
        {/* Prev */}
        <button
          onClick={() => goTo(current - 1)}
          disabled={atStart}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition
            ${atStart ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers (sliding window) */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`w-8 h-8 rounded-lg border transition
              ${p === current
                ? "bg-purple-700 text-white border-transparent"
                : "bg-white hover:bg-gray-100 text-gray-700"}`}
            aria-current={p === current ? "page" : undefined}
            aria-label={`Page ${p}`}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => goTo(current + 1)}
          disabled={atEnd}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border transition
            ${atEnd ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
