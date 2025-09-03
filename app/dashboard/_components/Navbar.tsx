"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const navbarItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  //{ name: "Blog", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "The Wall", href: "/community" },
  { name: "About Us", href: "/about-us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Load cached profile from localStorage immediately
    const cachedFullName = localStorage.getItem("userFullName");
    const cachedAvatar = localStorage.getItem("avatarUrl");

    if (cachedFullName) setFullName(cachedFullName);
    if (cachedAvatar) setAvatarUrl(cachedAvatar);

    // 2. Fetch fresh profile from Supabase in background
    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (!session?.user) return;

      const { data: profile, error } = await supabaseBrowser
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!error && profile) {
        setFullName(profile.full_name || cachedFullName);
        setAvatarUrl(profile.avatar_url || cachedAvatar);

        // Update cache
        localStorage.setItem("userFullName", profile.full_name || "");
        localStorage.setItem("avatarUrl", profile.avatar_url || "");
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="bg-primary z-9999 text-white">
      <div className="layout h-20 px-4 lg:px-20 md:px-4 gap-8 flex items-center justify-between">
        {/* Logo */}
        <Image
          width={116}
          height={48}
          onClick={() => router.push("/")}
          alt="ivin logo"
          src="/ivin-logo.svg"
          className="cursor-pointer"
        />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center w-full">
          {/* Middle nav items */}
          <div className="flex flex-1 justify-center lg:space-x-10 md:space-x-1 gap-6">
            {navbarItems.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side: Avatar + full_name OR Dealer Login */}
          {fullName ? (
            <div className="ml-auto flex items-center gap-2">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="user avatar"
                  width={32}
                  height={32}
                  className="rounded-full border border-white"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold">{fullName}</span>
            </div>
          ) : (
            <Link href="/dealer-login" className="underline ml-auto">
              Dealer Login
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-6">
          {navbarItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)} // close menu on click
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile: Avatar + fullname or Dealer Login */}
          {fullName ? (
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="rounded-full border border-white"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold">{fullName}</span>
            </div>
          ) : (
            <Link
              href="/dealer-login"
              className="underline"
              onClick={() => setIsOpen(false)}
            >
              Dealer Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
