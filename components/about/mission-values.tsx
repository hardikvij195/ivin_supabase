export default function MissionValues() {
  return (
    <div className="layout flex flex-col md:flex-row items-start justify-between xl:px-20 px-8 xl:pt-16 pt-8 gap-10 md:gap-20">
      <div className="p-8 bg-[#F8F0FF] border-t-4 border-t-primary">
        <p className="font-fredoka text-primary text-[32px] font-bold mb-6">
          Our mission
        </p>
        <p className="text-[18px] text-[#1C1C1C]">
          Empower car buyers and sellers with reliable insights, so they can
          move forward with confidence.
        </p>
      </div>

      <div className="p-8 bg-[#F8F0FF] border-t-4 border-t-primary">
        <p className="font-fredoka text-primary text-[32px] font-bold mb-6">
          Our Values
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <div className="mb-2">
              <p className="text-[18px] text-primary font-semibold mb-2">
                • Integrity
              </p>
              <p className="text-[#1C1C1C]">
                We do what’s right, even when no one’s looking.
              </p>
            </div>

            <div className="mb-2" >
              <p className="text-[18px] text-primary font-semibold mb-2">
                • Transparency
              </p>
              <p className="text-[#1C1C1C]">
                Clear, honest communication — always.
              </p>
            </div>

            <div>
              <p className="text-[18px] text-primary font-semibold mb-2">
                • Objectivity
              </p>
              <p className="text-[#1C1C1C]">
                We’re guided by verified facts, not assumptions.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2">
              <p className="text-[18px] text-primary font-semibold mb-2">
                • Customer-First
              </p>
              <p className="text-[#1C1C1C]">
                Every decision we make starts with your needs.
              </p>
            </div>

            <div>
              <p className="text-[18px] text-primary font-semibold mb-2">
                • Solution-Driven
              </p>
              <p className="text-[#1C1C1C]">
                We turn complex data into simple, actionable information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
