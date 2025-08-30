export default function CustomerSupport() {
    return (
      <div className="layout xl:px-20 px-8 xl:pt-18 pt-12  text-white ">
         
         <div className=" xl:px-20 px-8 xl:py-10 py-5 flex items-center justify-between bg-[linear-gradient(180deg,_#5E189D_0%,_#C8A0EB_100%)] rounded-[24px] ">
        <div className="h-fit">
            <p className="mb-6 font-fredoka font-semibold text-[30px] lg:text-[40px]">Customer Support</p>
            <p className="text-[20px] max-w-136 mb-10">Need help? We're here for you. Our support team is ready to assist you anytime.</p>
            <button className="font-semibold border font-fredoka bg-white text-primary border-primary px-6 py-4 flex gap-[10px] rounded-full shadow-[0px_4px_4px_0px_#00000040]"> <img src={"/home/whatsapp.svg"}></img>  <p> Chat via WhatsApp</p></button>
        </div>
         
         <div className="hidden md:block">
            <img src={"/home/support.svg"} alt="support"/>
         </div>
         </div>
      </div>
    );
  }
  