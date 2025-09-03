"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  List,
  CreditCard,
  FileChartColumnIncreasing,
  MessageCircleMore,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { clearUser } from "@/store/reducers/userSlice";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  {
    href: "/dashboard/generate-new-report",
    icon: FileText,
    label: "Get New Report",
  },
  {
    href: "/dashboard/reports-list-generated",
    icon: List,
    label: "Reports List Generated",
  },
  { href: "/dashboard/payments", icon: CreditCard, label: "Payments" },
  {
    href: "/dashboard/reports",
    icon: FileChartColumnIncreasing,
    label: "Reports",
  },
  { href: "/dashboard/messages", icon: MessageCircleMore, label: "Messages" },
  { href: "/dashboard/the-wall", icon: Users, label: "The Wall" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const applyMQ = (mq: MediaQueryList | MediaQueryListEvent) => {
      const matches =
        "matches" in mq ? mq.matches : (mq as MediaQueryList).matches;
      setIsMobile(matches);
      if (!matches) setCollapsed(false); 
      if (matches) setCollapsed(true); 
    };
    applyMQ(mql);
    mql.addEventListener?.("change", applyMQ as any);
    setMounted(true);
    return () => mql.removeEventListener?.("change", applyMQ as any);
  }, []);

  
  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [pathname, isMobile]);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("modal_shown");
      await supabaseBrowser.auth.signOut();
      dispatch(clearUser());
       localStorage.removeItem("userFullName");
    localStorage.removeItem("userAvatarUrl");
    localStorage.removeItem("userRole");
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const showLabels = !collapsed;
  const baseWidth = collapsed ? "w-20" : "w-64";
  const desktopWidth = collapsed ? "lg:w-20" : "lg:w-64";

  return (
    <>
      
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          isMobile && !collapsed
            ? "fixed min-h-screen inset-y-0 left-0 top-16 z-50"
            : "static",
          "max-h-screen flex flex-col justify-between",
          "border border-[#EAEAEA] bg-white shadow-md transition-[width] duration-300 ease-in-out",
          "lg:rounded-[16px] rounded-lg lg:ml-5 lg:my-5",
          baseWidth,
          desktopWidth,
          !mounted && "opacity-0"
        )}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-end px-2 py-3">
            <button
              type="button"
              className="p-2 rounded-md hover:bg-gray-100 transition"
              onClick={() => setCollapsed((c) => !c)}
              aria-expanded={!collapsed}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-700" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>

          <ul className="flex-1 space-y-1 px-2 py-2">
            {navItems.map((item, i) => {
              const isActive = pathname === item.href;
              return (
                <li key={i}>
                  <SidebarItem
                    icon={item.icon}
                    title={item.label}
                    isActive={isActive}
                    showLabels={showLabels}
                    onClick={() => router.push(item.href)}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-2 border-t border-gray-200">
          <SidebarItem
            icon={LogOut}
            title="Log out"
            isActive={false}
            showLabels={showLabels}
            onClick={handleLogout}
          />
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  icon: Icon,
  title,
  isActive,
  showLabels,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  isActive: boolean;
  showLabels: boolean;
  onClick: () => void;
}) {
  const isLogout = title === "Log out";
  const color = isLogout ? "#B50F02" : "#0A0A0A";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-colors text-left",
        isActive && !isLogout ? "bg-[#F4EBFF]" : "hover:bg-[#FAFAFA]"
      )}
      title={!showLabels ? title : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" style={{ color }} />
      {showLabels && (
        <span
          className="text-[14px] font-medium leading-normal"
          style={{ color }}
        >
          {title}
        </span>
      )}
    </button>
  );
}
