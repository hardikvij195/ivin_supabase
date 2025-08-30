"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";
import SidebarMessage, { SidebarItem } from "./sidebar-message";

export default function ConversationSidebar() {
  // mock items – replace with your data
  const items = useMemo<SidebarItem[]>(
    () => [
      {
        id: "1",
        name: "VinDetective",
        avatar: "/user.png",
        last: "Yes, I’ve seen that VIN in an auction before.",
        time: "10:45 AM",
        online: true,
        active: true,
      },
      {
        id: "2",
        name: "DealerPrime",
        avatar: "/user.png",
        last: "Typing…",
        time: "10:45 AM",
        typing: true,
      },
      {
        id: "3",
        name: "WheelsZone",
        avatar: "/user.png",
        last: "Sending you the service records.",
        time: "10:45 AM",
      },
      { id: "4", name: "SpeedyAutoDeals", avatar: "/user.png", last: "Do you have more info on the Title?", time: "10:45 AM" },
      { id: "5", name: "MetroMotors", avatar: "/user.png", last: "That unit is already sold, FYI.", time: "10:45 AM" },
    ],
    []
  );

  return (
    <div className="flex h-full flex-col rounded-[12px] bg-white p-4">
      {/* Search */}
      <div className="mb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-300"
            placeholder="Search"
          />
        </div>
      </div>

      {/* List */}
      <div className="custom-scrollbar -mx-2 grow overflow-y-auto px-2">
        {items.map((it) => (
          <SidebarMessage key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
}
