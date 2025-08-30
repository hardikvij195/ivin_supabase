import { Posts } from "./community-post";
import CommunityReportsToolbar from "./community-report-toolbar";

export default function CommunityReports() {
  return (
    <div>
      <div className="layout xl:px-20 px-8 xl:pt-14 pt-8">
        <p className="font-fredoka font-semibold text-[30px] lg:text-[40px] text-[#1C1C1C] mb-5 text-center">
          The <span className="text-primary">Wall</span>
        </p>
        <p className="text-[18px] text-center max-w-233 m-auto text-[#4D4D4D] mb-10">
          Discover recent vehicle history checks and insights shared by the iVin
          community. Learn from others and contribute your own observations.
        </p>
      </div>
      <div>
        <div className="layout xl:px-20 px-8 flex  flex-wrap gap-16">
          <div className="flex-1 p-0 sm:p-6">
            <div className="mb-10">
              <CommunityReportsToolbar />
            </div>
           <Posts/>
          </div>
        </div>
      </div>
    </div>
  );
}
