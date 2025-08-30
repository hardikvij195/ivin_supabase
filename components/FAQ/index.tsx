import Banner from "@/components/banner";
import QuestionAnswer from "./question-answer";

const faqData = [
    {
      question: "What is an iVin Report?",
      answer:
        "An iVin Report is a comprehensive vehicle history report that helps you make smarter buying or selling decisions...",
    },
    {
      question: "Is the iVin Report free?",
      answer: "The iVin Report may have free and paid versions depending on the details you need.",
    },
  ];

export default function FAQ() {
  return (
    <>
    <Banner heading="Frequently Asked Questions (FAQ)" />
    <div className="px-4 pt-10 max-w-320 m-auto flex flex-col gap-8">
    {faqData.map((item, index) => (
        <QuestionAnswer key={index} question={item.question} answer={item.answer} />
      ))}
  
    </div>
    </>
  );
}
