import Hero from "@/components/Home/Hero";
import Header from "@/components/Header";
import React from "react";
import Features from "@/components/Home/features";
import Tools from "@/components/Home/tools";
import WhyChooseUs from "@/components/Home/why-choose-us";
import CustomerSupport from "@/components/Home/customerSupport";
import Partnership from "@/components/Home/partnership";
import { Footer } from "@/components/Footer";

const page = () => {
  return (
    <div>
   
      <Hero />
      <Features />
      <Tools />
      <WhyChooseUs />
      <CustomerSupport />
      {/*<Partnership />*/}
   
    </div>
  );
};

export default page;
