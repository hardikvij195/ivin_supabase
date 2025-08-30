import ConversationDetails from "./conversation-details";
import ConversationSidebar from "./conversation-sidebar";
import SidebarMessage from "./sidebar-message";

export default function Chat() {
  return (
    <div className="bg-gray-50 flex flex-col h-full">
      <div className="flex justify-between mb-[12px]">
        <p className="font-fredoka text-[#1C1C1C] text-[32px] font-semibold">
          Message
        </p>
        <img width={20} src={"/file.svg"} alt="more" />
      </div>

      <div className="flex gap-5 h-full">
        <div className=" h-full">
          <ConversationSidebar />
        </div>
        <div className="flex-1 h-full">
          <ConversationDetails />
        </div>
      </div>
    </div>
  );
}
