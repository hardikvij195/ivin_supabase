"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import FloatingActionButton from '../components/FloatingActionButton'

export function Footer() {
  const router = useRouter();

  return (
    <div className="bg-[#F1D8FE] px-8 xl:px-20  py-6 xl:py-10 xl:mt-20 mt-8 ">
      <div className="layout flex flex-col w-full justify-between gap-8 sm:gap-10 flex-wrap">
        <div className="flex justify-between flex-wrap gap-8">
          <div className="col-span-6">
            <img
              className="mb-8"
              src={"/ivin-logo-footer.svg"}
              alt="iVin logo footer"
            />
            <p className="sm:text-[18px]  font-semibold">Ready to get started?</p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-6">
            <p className="text-[20px] font-semibold text-primary">Company</p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]"><Link href="/about-us"> About Us </Link></p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]"><Link href="/features"> Features</Link></p>
            {/*<p className="sm:text-[18px] font-medium text-[#1C1C1C]">Blog</p>*/}
          </div>
          <div className="flex flex-col gap-3 sm:gap-6">
            <p className="text-[20px] font-semibold text-primary">HELP</p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]"><Link href="/faq">FAQ</Link></p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]"><Link href='contact-us'>Contact Us</Link></p>
          </div>
          <div className="flex flex-col gap-3 sm:gap-6">
            <p className="text-[20px] font-semibold text-primary">CONTACT</p>
            <div className="flex gap-[12px]">
            <img src={"/footer/call.svg"} alt="call" />
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]"> +1 (416)-123-4567</p>
            </div>
            <div className="flex gap-[12px]">
            <img src={"/footer/location.svg"} alt="location" />
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]">Toronto, Canada</p>
            </div>
            <div className="flex gap-[12px]">
            <img src={"/footer/whatsapp.svg"} alt="whatsapp" />
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]">+1 (416)-123-4567</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-2 sm:items-center flex-col sm:flex-row">
          <div className="flex gap-2 flex-col sm:flex-row sm:gap-10 flex-wrap">
            <p className="sm:text-[18px] font-medium"><Link href="/terms">Terms & Conditions</Link></p>
            <p className="sm:text-[18px] font-medium"><Link href="/privacy">Privacy Policy</Link></p>
          </div>
          <div className="flex sm:justify-between gap-6 mt-5">
            <button className="p-2 rounded-md  bg-[#DFC3EE]">
              <Link href="https://www.instagram.com" target="_blank"><img src={"/footer/instagram.svg"} alt="instagram" /></Link>
            </button>
            <button className="p-2 rounded-md  bg-[#DFC3EE]">
              <Link href="https://www.facebook.com" target="_blank"><img src={"/footer/facebook.svg"} alt="facebook" /></Link>
            </button>
            {/*<button className="p-2 rounded-md  bg-[#DFC3EE]">
              <img src={"/footer/mail.svg"} alt="mail" />
            </button>*/}
                 <FloatingActionButton />
          </div>
        </div>
      </div>
    </div>
  );
}
