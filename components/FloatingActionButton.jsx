import React from "react";


const FloatingActionButton = () => {
  // Animation variants for action buttons
  
  // Handler for WhatsApp Click
  // const handleWhatsAppClick = () => {
  //   window.open("https://wa.me/14692146349?text=Interested", "_blank");
  // };

  // Handler for Phone Click
  // const handlePhoneClick = () => {
  //   window.open("tel:+919773603818", "_blank");
  // };

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-20 flex flex-col items-center sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
       <a
        href="https://wa.me/+918588099741?text=Interested"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed  bottom-32 lg:bottom-12 right-8 lg:right-28 rounded-full shadow-lg transition-all duration-300 z-[99] bg-white shadow-green-700 p-3 animate-buzzer"
        aria-label="Chat on WhatsApp"
      >
        <img src="/wapp.png" className="w-10 h-10" alt="WhatsApp" />
      </a>
      <div className="bg-green-600 font-fredoka font-bold fixed bottom-44 lg:bottom-16 -right-10 lg:right-28 transform -translate-x-1/2  text-white lg:text-md text-sm px-3 py-1.5 shadow-sm rounded-full animate-bounce z-[100]">
        Chat with us
      </div> 

      <a
        href="https://calendar.app.google/pK7TnxSfhow4zmT18"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-12 right-8 lg:right-12 rounded-full shadow-lg transition-all duration-300 z-[99] bg-white shadow-green-700 p-3 animate-buzzer"
        aria-label="Chat on Meet"
      >
        <img src="/meet.png" className="w-10 h-10" alt="meet" />
      </a>
    </div>
  );
};

export default FloatingActionButton;
