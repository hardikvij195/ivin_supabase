"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  id: string;
  name: string;
  avatar: string;
  last: string;
  time: string;
  online?: boolean;
  typing?: boolean;
  unread?: number;
  active?: boolean;
};

export default function SidebarMessage({ item }: { item: SidebarItem }) {
  return (
    <Link
      href={`/messages/${item.id}`}
      className={cn(
        "flex items-start gap-3 rounded-xl p-3 transition",
        item.active ? "bg-purple-50" : "hover:bg-gray-50"
      )}
    >
      {/* avatar */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
        <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
        {item.online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      {/* meta */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <p className="truncate text-[15px] font-medium text-[#1C1C1C]">{item.name}</p>
          <p className="shrink-0 pl-2 text-[12px] text-[#4D4D4D]">{item.time}</p>
        </div>
        <p
          className={cn(
            "truncate text-[13px]",
            item.typing ? "text-purple-700" : "text-[#4D4D4D]"
          )}
        >
          {item.last}
        </p>
      </div>
    </Link>
  );
}
