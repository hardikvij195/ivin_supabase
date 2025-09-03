"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

const baseItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "FAQ", href: "/faq" },
  { name: "The Wall", href: "/community" },
  { name: "About Us", href: "/about-us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // 👈 new
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem("userFullName");
    const storedAvatar = localStorage.getItem("userAvatarUrl");
    if (storedName) setFullName(storedName);
    if (storedAvatar) setAvatarUrl(storedAvatar);

    const fetchProfile = async () => {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();

      if (session?.user) {
        const { data: profile, error } = await supabaseBrowser
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!error && profile) {
          if (profile.full_name) {
            setFullName(profile.full_name);
            localStorage.setItem("userFullName", profile.full_name);
          }
          if (profile.avatar_url) {
            setAvatarUrl(profile.avatar_url);
            localStorage.setItem("userAvatarUrl", profile.avatar_url);
          }
        }
      }
      setLoading(false); // 👈 stop loading after fetch
    };

    fetchProfile();
  }, []);

  const itemsToShow = fullName
    ? [
        baseItems[0],
        { name: "Dashboard", href: "/dashboard" },
        ...baseItems.slice(1),
      ]
    : baseItems;

  return (
    <header className="bg-primary z-9999 text-white">
      <div className="layout h-20 px-4 lg:px-20 md:px-4 gap-8 flex items-center justify-between">
        <Image
          width={116}
          height={48}
          onClick={() => router.push("/")}
          alt="ivin logo"
          src="/ivin-logo.svg"
          className="cursor-pointer"
        />

        <nav className="hidden md:flex items-center w-full">
          <div className="flex flex-1 justify-center lg:space-x-10 md:space-x-1 gap-6">
            {itemsToShow.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>

          {!loading && !fullName && ( // 👈 show only after loading check
            <Link href="/dealer-login" className="underline ml-auto">
              Dealer Login
            </Link>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-6">
          {itemsToShow.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {!loading && !fullName && ( // 👈 also here
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
