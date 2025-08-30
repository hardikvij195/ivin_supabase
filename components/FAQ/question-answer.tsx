"use client";

import { useState, useRef, useEffect } from "react";

interface QuestionAnswerProps {
  question: string;
  answer: string;
}

export default function QuestionAnswer({ question, answer }: QuestionAnswerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const toggleAnswer = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="overflow-hidden transition-all duration-300">
      {/* Question Header */}
      <div
        onClick={toggleAnswer}
        className={`flex justify-between items-center px-10 py-[22.5px] bg-[#F8F8F8] border border-[#DFC3EE] cursor-pointer transition-all duration-300 ${
          isOpen ? "rounded-t-[8px] rounded-b-none" : "rounded-[8px]"
        }`}
      >
        <p className="text-primary font-semibold text-[18px]">{question}</p>
        <img
          src={isOpen ? "/faq/minus.svg" : "/faq/plus.svg"}
          alt={isOpen ? "minus" : "plus"}
        />
      </div>

      {/* Animated Answer Box */}
      <div
        style={{ height: `${height}px` }}
        className="transition-all duration-300 ease-in-out overflow-hidden bg-primary text-white border border-t-0 rounded-b-[8px]"
      >
        <div ref={contentRef} className="px-10 py-4">
          <p className="text-[18px]">{answer}</p>
        </div>
      </div>
    </div>
  );
}
