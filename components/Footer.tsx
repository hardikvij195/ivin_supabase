"use client";

import { useRouter } from "next/navigation";

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
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]">About us</p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]">Featues</p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]">Blog</p>
          </div>
          <div className="flex flex-col gap-3 sm:gap-6">
            <p className="text-[20px] font-semibold text-primary">HELP</p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]">FAQ</p>
            <p className="sm:text-[18px] font-medium text-[#1C1C1C]">Contact Us</p>
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
            <p className="sm:text-[18px] font-medium">Terms & Conditions</p>
            <p className="sm:text-[18px] font-medium">Privacy Policy</p>
          </div>
          <div className="flex sm:justify-between gap-6 mt-5">
            <button className="p-2 rounded-md  bg-[#DFC3EE]">
              <img src={"/footer/instagram.svg"} alt="instagram" />
            </button>
            <button className="p-2 rounded-md  bg-[#DFC3EE]">
              <img src={"/footer/facebook.svg"} alt="facebook" />
            </button>
            <button className="p-2 rounded-md  bg-[#DFC3EE]">
              <img src={"/footer/mail.svg"} alt="mail" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
