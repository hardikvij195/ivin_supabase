import { Posts } from "./community-post";
import Note from "./assets/note.svg";

type ReportProps = {
  isVerified?: boolean;
};

export default function CommunityProfile({ isVerified }: ReportProps) {
  return (
    <div className="layout xl:px-10 px-8 xl:pt-14 pt-8">
      <div className=" px-4 py-4 sm:px-10 sm:py-8 bg-[#F8F0FF] rounded-xl gap-8 flex flex-col md:flex-row">
       
          <div className=" flex-1 flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="rounded-full overflow-hidden mr-2">
                <img width={80} src="/community/user.png" alt="User" />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[#1C1C1C] font-semibold">
                    @AutoMasterPro{" "}
                  </span>
                  {isVerified && (
                    <img src="/community/verified-20.svg" alt="Verified" />
                  )}
                </div>
                <span className="text-[#4D4D4D] text-[14px]">
                  Active 5 minutes ago
                </span>
              </div>
            </div>

            <button className="font-fredoka text-[20px] font-semibold text-primary bg-transparent w-fit rounded-full px-6 py-2 sm:px-8 sm:py-[12px] border border-primary">
              Chat with Dealer
            </button>
          </div>
        
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex gap-1 items-center">
            <Note />
            <p className="text-[18px] text-[#4D4D4D]">Location:</p>
            <p className="font-medium">Jakarta, Indonesia</p>
          </div>
          <div className="flex gap-1 items-center">
            <Note />
            <p className="text-[18px] text-[#4D4D4D]">Member Since:</p>
            <p className="font-medium">Jakarta, Indonesia</p>
          </div>
          <div className="flex gap-1 items-center">
            <Note />
            <p className="text-[18px] text-[#4D4D4D]">Insights:</p>
            <p className="font-medium">Jakarta, Indonesia</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[24px] font-semibold mt-13 mb-8">All Reports</p>
        <Posts />
      </div>
    </div>
  );
}
