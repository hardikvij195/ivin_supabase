"use client";

import { EllipsisVertical, Paperclip, SendHorizonal } from "lucide-react";

export default function ConversationDetails() {
  return (
    <div className="flex h-full flex-col rounded-[12px] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <img src="/user.png" alt="avatar" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#1C1C1C]">VinDetective</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>
        <button className="rounded-full p-2 hover:bg-gray-50">
          <EllipsisVertical className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Messages */}
      <div className="custom-scrollbar grow space-y-4 overflow-y-auto px-5 py-4">
        {/* Day pill */}
        <div className="flex justify-center">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            Yesterday
          </span>
        </div>

        {/* left bubble */}
        <div className="flex flex-col items-start gap-1">
          <div className="max-w-[70%] rounded-2xl bg-gray-100 px-4 py-3 text-[14px] text-gray-800">
            Hey, do you have more details about the service history of this unit?
          </div>
          <span className="pl-2 text-[11px] text-gray-400">10:42 AM</span>
        </div>

        {/* right bubble */}
        <div className="flex flex-col items-end gap-1">
          <div className="max-w-[70%] rounded-2xl bg-[#5E189D] px-4 py-3 text-[14px] text-white">
            Sure, it was serviced regularly until 2023. No major accidents reported either.
          </div>
          <span className="pr-2 text-[11px] text-gray-400">10:44 AM</span>
        </div>

        {/* left bubble */}
        <div className="flex flex-col items-start gap-1">
          <div className="max-w-[70%] rounded-2xl bg-gray-100 px-4 py-3 text-[14px] text-gray-800">
            Thanks! Looks clean. How’s the resale in Jakarta market lately?
          </div>
          <span className="pl-2 text-[11px] text-gray-400">10:45 AM</span>
        </div>

        {/* right bubble */}
        <div className="flex flex-col items-end gap-1">
          <div className="max-w-[70%] rounded-2xl bg-[#5E189D] px-4 py-3 text-[14px] text-white">
            About IDR 195–210 mil depending on mileage. You planning to list it?
          </div>
          <span className="pr-2 text-[11px] text-gray-400">10:46 AM</span>
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2">
          <input
            className="h-10 grow rounded-full px-3 text-[14px] outline-none placeholder:text-gray-400"
            placeholder="Type a message…"
          />
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-50">
            <Paperclip className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5E189D] text-white hover:bg-[#4a1387]">
            <SendHorizonal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
