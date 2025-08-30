"use client";
import { useEffect, useState, useMemo } from "react";

export default function PrintableReport({ searchParams }) {
  const idFromQuery = searchParams?.id || "";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const reportId = idFromQuery;

  useEffect(() => {
    let ignore = false;
    async function run() {
      try {
        if (!reportId) return;
        const res = await fetch(`/api/proxyCarfaxJson?id=${reportId}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [reportId]);

  const vd = data?.VehicleDetailsViewModel || {};
  const tiles = data?.VehicleHistoryTilesViewModel || {};
  const rec = data?.RecallsViewModel || {};

  const regSummary =
    tiles?.RegistrationSummary?.SummaryData?.RegistrationSummary?.SummaryText ||
    "—";
  const serviceCount = Number(tiles?.ServiceRecords || 0);
  const hasUS = !!tiles?.HasUsRecords;
  const hasImport = !!tiles?.HasImportRecords;
  const recallCount =
    Number(tiles?.RecallCount || 0) ||
    (Array.isArray(rec?.Recalls) ? rec.Recalls.length : 0);
  const hasAccident = Number(tiles?.AccidentDamagesType || 0) > 0;
  const isStolen = !!tiles?.Stolen;

  const reportDate = useMemo(() => {
    if (!data) return "";
    const y = Number(data.ReportYear),
      m = Number(data.ReportMonth),
      d = Number(data.ReportDay);
    if (!y || !m || !d) return "";
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [data]);

  if (!reportId) {
    return (
      <div className="p-6">
        Missing <code>id</code> in URL. Use{" "}
        <code>/report?id=YOUR_REPORT_ID</code>.
      </div>
    );
  }
  if (loading) return <div className="p-6">Loading report…</div>;

  return (
    <div id="print-root" className=" relative min-h-screen bg-[#f6f7fb] print:bg-white">
      <div className="no-print mx-[15%]  z-10 flex items-center justify-between gap-6 text-[15px] text-neutral-900 bg-white/50 print:hidden">
        <div></div>
        <div className="flex  gap-8 mx-10 my-2">
          <div
            className="cursor-pointer select-none"
            onClick={() => window.print()}
          >
            Print
          </div>
          <div
            className="cursor-pointer select-none"
            onClick={() => alert("Email action here")}
          >
            Email
          </div>
        </div>
      </div>

      <section className="mx-[15%] bg-white px-[16mm] py-[18mm] shadow-sm print:m-0 print:min-h-[auto] print:w-auto print:shadow-none">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="logo" className="h-15 w-auto" />
          </div>

          <div className="min-w-[400px] rounded-lg border border-slate-200 px-3 py-2">
            <div className="my-1 flex items-center justify-between gap-4 text-[14px]">
              <span className="font-semibold text-neutral-900">
                Vehicle History Report #:
              </span>
              <span className="text-neutral-900">
                {data?.ReportNumber ?? "—"}
              </span>
            </div>
            <div className="my-1 flex items-center justify-between gap-4 text-[11px]">
              <span className="font-semibold text-neutral-900">
                Report Date:
              </span>
              <span className="text-neutral-900">
                {reportDate}
                {data?.ReportTime ? ` | ${data.ReportTime}` : ""}
              </span>
            </div>
            <div className="my-1 flex items-center justify-between gap-4 text-[11px]">
              <span className="font-semibold text-neutral-900">
                Report Status:
              </span>
              <span className="text-neutral-900">
                {data?.IsReportComplete ? "Complete" : "In Progress"}
              </span>
            </div>
          </div>
        </header>

        {/* Vehicle block */}
        <div className="mt-5">
          <h1 className="m-0 text-[22px] font-bold leading-tight text-neutral-900">
            {[vd.VehicleYear, vd.VehicleMake, vd.VehicleModel, vd.VehicleTrim]
              .filter(Boolean)
              .join(" ")}
          </h1>

          <div className="mt-1 text-neutral-900">
            {[
              vd.BodyStyle?.toLowerCase(),
              vd.Cylinders ? `${vd.Cylinders} Cylinders` : null,
              vd.FuelType,
            ]
              .filter(Boolean)
              .join("  |  ")}
          </div>

          <div className="mt-1">{vd.Vin}</div>

          <div>
            <span className="font-semibold text-neutral-900">
              Country of Assembly:
            </span>{" "}
            <span className="text-neutral-900">
              {vd.CountryOfAssembly || "—"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-neutral-900">
              Last Reported Odometer:
            </span>{" "}
            <span className="text-neutral-900">
              {vd.LastReportedOdometer || "—"}
            </span>
          </div>
        </div>

        <hr className="my-20 border-0 border-t border-slate-200" />

        <div className="mt-6 grid grid-cols-3 gap-10">
          <Tile
            title={
              hasAccident
                ? "Accident/Damage Records Found"
                : "No Accident/Damage Records"
            }
            danger={hasAccident}
            icon="/accident-damage-bad.svg"
            onClick={() => jumpTo("#accident")}
          />
          <Tile
            title={`Last Registered In: ${regSummary}`}
            icon="/registration-tile.svg"
            onClick={() => jumpTo("#registration")}
          />
          <Tile
            title={`${serviceCount} Service Records Found`}
            icon="/service-records-tile.svg"
            onClick={() => jumpTo("#service")}
          />
          <Tile
            title={hasUS ? "U.S. History Found" : "No U.S. History Found"}
            icon="/us-tile.svg"
          />
          <Tile
            title={
              recallCount > 0 ? "Open Recalls Found" : "No Open Recalls Found"
            }
            icon="/recalls-tile.svg"
          />
          <Tile
            title={
              isStolen
                ? "Actively Declared Stolen"
                : "Not Actively Declared Stolen"
            }
            danger={isStolen}
            icon="/stolen-tile.svg"
          />
          <Tile
            title={hasImport ? "Import Record Found" : "No Import Record Found"}
            icon="/import-tile.svg"
          />

          <div className="col-span-2 col-start-2 flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="m-0 text-[22px] font-semibold text-slate-800">
              Questions?
              <span className="font-normal ml-2">We're here to help.</span>
            </p>
            <div className="mt-2 text-[15px]">
              <a
                href="#"
                className="font-semibold text-sky-600 hover:underline"
              >
                Customer Support
              </a>
              <span className="mx-3 text-slate-300">|</span>
              <a
                href="#"
                className="font-semibold text-sky-600 hover:underline"
              >
                FAQ &amp; Glossary
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 rounded-lg border border-slate-300 bg-[#fafafa] p-3 text-[11px] text-slate-600">
          This vehicle history report is based on information that was reported
          and available as of the report date. There may be other information
          about this vehicle that has not been reported. Use this with a
          mechanical inspection and test drive.
        </div>
      </section>

      {/* SERVICE RECORDS */}

      <section
        id="accident"
        className="mx-[15%]  bg-white py-[18mm] shadow-sm print:m-0 print:min-h-[auto] print:w-auto print:shadow-none"
      >
        <h2 className="mb-2 bg-gray-100 px-10 py-14 text-4xl font-bold text-gray-600">
          Vehicle History Report
        </h2>

        <div className="mt-8 px-[16mm]">
          <div className="flex items-center gap-4 relative">
            <img src="/accident-damage-bad.svg" className="h-20 w-20" />
            <div className="text-3xl font-semibold flex items-center gap-2">
              Accident/Damage
              {/* Info Tooltip */}
              <div className="relative group">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-white text-xs font-bold cursor-pointer">
                  i
                </span>
                {/* Tooltip box */}
                <div className="absolute left-1/2 top-full z-10 mt-2 hidden w-[400px] -translate-x-1/2 rounded-md bg-neutral-900 px-4 py-3 text-center text-sm text-white group-hover:block">
                  There are many ways that a vehicle can sustain damage, but it
                  typically falls into one of two categories: a motor vehicle
                  accident (where the vehicle collides with another vehicle, a
                  tree, an animal, etc.), or other damage which can include
                  things like hail damage, fire, vandalism, etc. In either case,
                  damage can range from minor (scratches, dings, etc.) to severe
                  (broken axles, bent frame, etc.).
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-x-8 border-b-8 border-x-transparent border-b-neutral-900" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <AccidentTable
          groups={
            data?.AccidentDamagesViewModel?.AccidentRollupTableGroups || []
          }
        />
      </section>

      <section
        id="service"
        className="mx-[15%] bg-white py-[18mm] shadow-sm print:m-0 print:w-auto print:shadow-none"
      >
        <div className="px-[16mm]">
          <div className="flex items-center gap-4">
            <img src="/service-records-tile.svg" className="h-14 w-14" />
            <h2 className="m-0 text-3xl font-semibold text-slate-800">
              Service Records
            </h2>
          </div>

          <ServiceRecordsTable
            items={data?.ServiceHistoryViewModel?.ServiceHistoryItems || []}
          />
        </div>
      </section>

      <section
        id="registration"
        className="mx-[15%]  bg-white py-[18mm] shadow-sm print:m-0 print:min-h-[auto] print:w-auto print:shadow-none"
      >
        <div className=" px-[16mm]">
          <div className="flex items-center gap-4 relative">
            <img src="/registration-tile.svg" className="h-20 w-20" />
            <div className="text-3xl font-semibold flex items-center gap-2">
              Registration
              {/* Info Tooltip */}
              <div className="relative group">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-white text-xs font-bold cursor-pointer">
                  i
                </span>
                {/* Tooltip box */}
                <div className="absolute left-1/2 top-full z-10 mt-2 hidden w-[400px] -translate-x-1/2 rounded-md bg-neutral-900 px-4 py-3 text-center text-sm text-white group-hover:block">
                  In Canada, when a vehicle is registered with the Ministry of
                  Transportation, “branding” is applied to classify the
                  condition of the vehicle. Salvage, Rebuilt, Junk and
                  Non-Repairable are examples of negative vehicle branding in
                  Canada. In the U.S., when a vehicle is registered with the
                  Department of Motor Vehicles, a “title” is applied to classify
                  the condition of the vehicle. Salvage, Junk, Rebuilt, Fire,
                  Flood, Hail and Lemon are examples of negative vehicle titles
                  in the U.S.
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-x-8 border-b-8 border-x-transparent border-b-neutral-900" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-green-500 bg-green-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              {/* Check icon */}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-sm font-bold">
                ✓
              </span>

              <div className="flex flex-col">
                {/* Main text */}
                <p className="text-sm text-slate-800">
                  {data?.VehicleHistoryTilesViewModel?.RegistrationSummary
                    ?.SummaryData?.RegistrationSummary?.RegistrationItems
                    ?.length > 0
                    ? (() => {
                        const reg =
                          data.VehicleHistoryTilesViewModel.RegistrationSummary
                            .SummaryData.RegistrationSummary
                            .RegistrationItems[0];
                        return (
                          <>
                            This vehicle has been registered in the province of{" "}
                            <span className="font-semibold">
                              {reg.LocalizedJurisdiction}
                            </span>{" "}
                            in <span className="font-semibold">Canada</span>{" "}
                            with{" "}
                            <span className="font-semibold">
                              {reg.LocalizedBrandingValue}
                            </span>{" "}
                            branding.
                          </>
                        );
                      })()
                    : "No Canadian registration records found."}
                </p>

                {/* Sub text */}
                <p className="mt-2 text-xs italic text-slate-600">
                  <span className="font-semibold">We checked for:</span>{" "}
                  Inspection Required, Normal, Non-repairable, Rebuilt, Salvage
                  and Stolen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="recalls"
        className="mx-[15%]  bg-white py-[18mm] shadow-sm print:m-0 print:min-h-[auto] print:w-auto print:shadow-none"
      >
        <div className=" px-[16mm]">
          <div className="flex items-center gap-4 relative">
            <img src="/recalls-tile.svg" className="h-20 w-20" />
            <div className="text-3xl font-semibold flex items-center gap-2">
              Open Recalls
              {/* Info Tooltip */}
              <div className="relative group">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-400 text-white text-xs font-bold cursor-pointer">
                  i
                </span>
                {/* Tooltip box */}
                <div className="absolute left-1/2 top-full z-10 mt-2 hidden w-[400px] -translate-x-1/2 rounded-md bg-neutral-900 px-4 py-3 text-center text-sm text-white group-hover:block">
                  Recall notices are issued when the manufacturer or
                  transportation authority detects a potential safety issue or
                  defect with a group of vehicles. This section outlines any
                  open(unfixed) safety recalls on the vehicle that have been
                  reported by vinX. Previous saftey recalls that have been
                  fixed(closed) will not be shown in this section.
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-x-8 border-b-8 border-x-transparent border-b-neutral-900" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-green-500 bg-green-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full p-2 bg-green-500 text-white text-sm font-bold">
                ✓
              </span>

              <div className="flex flex-col">
                <p className="text-sm text-slate-800">
                  {data?.RecallsViewModel?.Recalls?.length > 0 ? (
                    "This vehicle has open recalls."
                  ) : (
                    <>
                      No safety recall information available as of the date/time
                      this report was generated. For additional safety recall
                      information and non-safety related recall campaigns,
                      please contact{" "}
                      <span className="font-semibold">
                        {data?.VehicleDetailsViewModel?.VehicleMake ||
                          "the manufacturer"}
                      </span>{" "}
                      or visit{" "}
                      <span className="text-sky-600 underline">
                        {data?.VehicleDetailsViewModel?.VehicleMake}'S Website
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* DETAILED HISTORY */}
      <section
        id="history"
        className="mx-[15%] bg-white py-[18mm] shadow-sm print:m-0 print:w-auto print:shadow-none"
      >
        <div className="px-[16mm]">
          <div className="flex items-center gap-4">
            <img src="/detailed-history.svg" className="h-14 w-14" />
            <h2 className="m-0 text-3xl font-semibold text-slate-800">
              Detailed History
            </h2>
          </div>

          <DetailedHistoryTable
            items={data?.ChronologyViewModel?.ChronologyItems || []}
          />
        </div>
      </section>
      {/* HELP & LEGAL / FOOTER */}
      <section
        id="help"
        className="mx-[15%] bg-white px-[16mm] pt-10 pb-16 shadow-sm print:m-0 print:px-0 print:shadow-none"
      >
        {/* Help row */}
        <div className="flex items-start gap-6">
          {/* Mascot / image */}
          <img src="/img-fox.png" alt="" className="h-24 w-24 object-contain" />

          <div className="flex-1">
            <h2 className="m-0 text-[32px] font-semibold text-slate-800">
              Questions? We’re here to help.
            </h2>

            <div className="mt-3 text-[15px] text-slate-700">
              100 Kellogg Ln Suite 301, London ON N5W 0B4
            </div>

            <div className="mt-2 text-[15px]">
              <a
                href="#"
                className="font-semibold text-sky-600 hover:underline"
              >
                Customer Support
              </a>
              <span className="mx-3 text-slate-300">|</span>
              <a
                href="#"
                className="font-semibold text-sky-600 hover:underline"
              >
                FAQ &amp; Glossary
              </a>
            </div>
          </div>
        </div>

        {/* divider */}
        <hr className="my-8 border-slate-200" />

        {/* Disclaimer */}
        <p className="text-[12px] leading-5 text-slate-600">
          This vehicle history report is compiled from multiple data sources. It
          is not always possible for vinX or its source data providers to obtain
          complete information on any one vehicle. For example, there may be
          other title, brands, registrations, declarations, accident
          information, service records, recall information, odometer readings or
          other information where discrepancies that apply to this vehicle are
          not reflected in this report. vinX and its source data providers
          receive data and information from external sources believed to be
          reliable, but no responsibility is assumed by vinX, its source data
          providers or its agents for any errors, inaccuracies or omissions. The
          reports are provided strictly on an as-is/where-is basis, and vinX and
          its source data providers further expressly disclaim all warranties,
          express or implied, including any warranties of timeliness, accuracy,
          merchantability, merchantable quality or fitness for a particular
          purpose regarding this report or its contents. Neither vinX nor any of
          its source data providers shall be liable for any losses, expenses or
          damages in connection with any report or any information contained
          within a report, including the accuracy thereof or any delay or
          failure to provide a report or any information. Other information
          about the vehicle that is the subject matter of this vehicle history
          report, including problems, may not have been reported to vinX. Use
          this report as one important tool, along with a vehicle inspection and
          test drive, to make a better decision about your next used car. By
          obtaining, reviewing and/or using this vehicle history report, you
          agree to be bound by all terms and conditions in vinX’s Conditions of
          Use and any vinX End User Licence Agreements as each may be amended
          from time to time by vinX.
        </p>

        {/* bottom bar */}
        <div className="mt-8 flex items-center justify-between gap-4 text-[12px] text-slate-500">
          <div>© {new Date().getFullYear()} vinX. All rights reserved.</div>

          {/* Logos (optional) */}
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-6" />
          </div>
        </div>
      </section>
    </div>
  );
}

function Tile({ title, danger = false, icon = "/icons/generic.png", onClick }) {
  // Split on ":" to mimic “Last Registered In: Ontario (Normal)”
  const hasColon = title.includes(":");
  const [lead, rest] = hasColon
    ? title.split(/:(.*)/).slice(0, 2)
    : [title, ""];

  return (
    <div
      className={`group flex flex-col items-center text-center  ${
        onClick ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={onClick}
    >
      {/* icon plate */}
      <div className="relative inline-flex h-35 w-35 items-center justify-center rounded-full group">
        {/* Image */}
        <img src={icon} alt="" className="h-35 w-35 rounded-full" />

        {/* Gray overlay (hidden until hover) */}
        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

        {/* Red dot */}
        {danger && (
          <span className="absolute -top-1 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow">
            !
          </span>
        )}
      </div>

      {hasColon ? (
        <div
          className={`mt-3 text-[16px] leading-5 ${
            danger ? "text-red-600" : "text-slate-500"
          }`}
        >
          <span>{lead}:</span>{" "}
          <span
            className={`${
              danger ? "font-semibold" : "font-semibold text-slate-700"
            }`}
          >
            {rest.trim()}
          </span>
        </div>
      ) : (
        <div
          className={`mt-3 text-[16px] leading-5 ${
            danger ? "text-red-600 font-semibold" : "text-slate-600"
          }`}
        >
          {title}
        </div>
      )}
    </div>
  );
}
function formatYMD(y, m, d) {
  if (!y || !m || !d) return "—";
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }); // e.g., "2020 Jan 18"
}

function InfoDot({ text }) {
  return (
    <div className="relative ml-2 inline-flex items-center group">
      {/* Info circle */}
      <span className="inline-flex h-5 w-5 items-center mt-2 justify-center rounded-full bg-slate-400 text-[11px] font-bold text-white cursor-pointer">
        i
      </span>

      {/* Tooltip ABOVE */}
      <div className="absolute left-1/2 bottom-full z-20 mb-2 hidden w-[360px] -translate-x-1/2 rounded-md bg-neutral-900 px-4 py-3 text-center text-sm text-white group-hover:block">
        {text}
        {/* little arrow (pointing down now) */}
        <div className="absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-full border-x-8 border-t-8 border-x-transparent border-t-neutral-900" />
      </div>
    </div>
  );
}

// --- the table component ---
export function AccidentTable({ groups = [] }) {
  if (!groups?.length) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        No accident or damage records found.
      </div>
    );
  }

  const cols = "220px 1fr 160px"; // date | details | amount

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white ">
      {/* header */}
      <div
        className="grid gap-4 bg-white px-6 py-5"
        style={{ gridTemplateColumns: cols }}
      >
        <div className="text-[14px] font-extrabold text-slate-800 tracking-wide">
          INCIDENT DATE
        </div>
        <div className="text-[14px] font-extrabold text-slate-800 tracking-wide">
          DETAILS
        </div>
        <div className="text-[14px] font-extrabold text-slate-800 tracking-wide text-right">
          AMOUNT
        </div>
      </div>

      {/* groups */}
      {groups.map((g, gi) => {
        const date = formatYMD(g.DateYear, g.DateMonth, g.DateDay);
        const location = g.LocationHeading || "—";
        const incidents = Array.isArray(g.Incidents) ? g.Incidents : [];

        // preferred “police” line
        const police = incidents.find(
          (i) =>
            (i.TitleType === 6 || i.RecordType === 0) &&
            (i.RawDetailText || i.RawClaimDescriptionText)
        );
        // preferred “claim” line
        const claim = incidents.find(
          (i) => i.TitleType === 4 || i.RecordType === 2
        );

        const policeText =
          (police &&
            (police.RawDetailText || police.RawClaimDescriptionText)) ||
          null;

        const claimText =
          (claim && (claim.RawClaimDescriptionText || claim.RawDetailText)) ||
          null;
        const rawAmount =
          (claim && claim.RawAmount && `$${claim.RawAmount}`) ||
          (claim && claim.RawClaimTypeText) ||
          "";

        const amount =
          rawAmount.toLowerCase() === "unknown" || rawAmount === "—"
            ? ""
            : rawAmount;

        return (
          <div key={gi} className="border-t border-slate-200">
            {/* blue-tint header row */}
            <div
              className="grid items-center gap-4 bg-sky-50/50 px-6 py-4"
              style={{ gridTemplateColumns: cols }}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-base font-bold text-white">
                  !
                </span>
                <span className="text-[13px] font-bold text-slate-700">
                  {date}
                </span>
              </div>
              <div className="text-[13px] font-bold text-slate-600">
                {location}
              </div>
              <div />
            </div>

            {/* detail row */}
            <div
              className="grid gap-4 px-6 py-4"
              style={{ gridTemplateColumns: cols }}
            >
              <div />
              <div className="space-y-4 text-[13px] leading-8 text-slate-600">
                {policeText && (
                  <div>
                    <span className="font-extrabold text-slate-600">
                      Police Reported Accident:
                    </span>{" "}
                    <span>{policeText}</span>
                  </div>
                )}

                {claimText && (
                  <div className="flex items-start">
                    <div>
                      <span className="font-extrabold text-slate-600">
                        Claim:
                      </span>
                      <span>{claimText}</span>
                    </div>
                    <InfoDot text="If the cost of the repair is put through insurance, there could be an associated insurance claim. Note that the insurance claims identified in this report do not include any medical payouts, damage to other vehicles, damage to property, towing, rental cars or any other incidental damages." />
                  </div>
                )}

                {!policeText && !claimText && <div>—</div>}
              </div>

              <div className="text-right text-[20px] text-slate-700">
                {amount && amount !== "—" ? amount : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ServiceRecordsTable({ items = [] }) {
  if (!items.length) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        No service records found.
      </div>
    );
  }

  // date | odometer | source | details
  const cols = "160px 160px 1fr 1.25fr";

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div
        className="grid gap-4 bg-white px-6 py-5"
        style={{ gridTemplateColumns: cols }}
      >
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          DATE
        </div>
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          ODOMETER
        </div>
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          SOURCE
        </div>
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          DETAILS
        </div>
      </div>

      {/* Rows */}
      {items.map((it, idx) => {
        const date = formatYMD(it.DateYear, it.DateMonth, it.DateDay);
        const odo = it.OdometerDisplay || "—";
        const srcName = it.DataSource || "—";
        const srcLoc = it.Location?.LocationString || "";
        const srcPhone = it.ServicePhone || "";

        // Build detail text + bullet list from Sections
        const lead = (it.Detail || "").trim(); // e.g., "Vehicle serviced"
        const bullets = Array.isArray(it.Sections)
          ? it.Sections.join("\n")
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        return (
          <div key={idx} className="border-t border-slate-200">
            {/* Top row (tint) */}
            <div
              className="grid items-start gap-4 bg-sky-50/50 px-6 py-4"
              style={{ gridTemplateColumns: cols }}
            >
              <div className="text-[13px] font-semibold text-slate-700">
                {date}
              </div>
              <div className="text-[13px] text-slate-600">{odo}</div>

              <div className="text-[13px] leading-6 text-slate-700">
                <div className="font-semibold">{srcName}</div>
                {srcLoc && <div className="text-slate-600">{srcLoc}</div>}
                {srcPhone && <div className="text-slate-600">{srcPhone}</div>}
              </div>

              <div className="text-[13px] leading-6 text-slate-700">
                {lead && (
                  <div className="font-semibold text-slate-700">{lead}</div>
                )}
                {!!bullets.length && (
                  <ul className="mt-1 list-disc pl-5 text-slate-700">
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Optional spacer row (keeps air like the reference) */}
            <div className="px-6 py-2" />
          </div>
        );
      })}
    </div>
  );
}

function DetailedHistoryTable({ items = [] }) {
  if (!items.length) {
    return (
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
        No detailed history found.
      </div>
    );
  }

  // Sort ascending by date (year, month, day) to match the reference
  const sorted = [...items].sort((a, b) => {
    const da = new Date(a.DateYear, a.DateMonth - 1, a.DateDay).getTime();
    const db = new Date(b.DateYear, b.DateMonth - 1, b.DateDay).getTime();
    return da - db;
  });

  // DATE | ODOMETER | SOURCE | RECORD TYPE | DETAILS
  const cols = "160px 150px 1fr 200px 1.25fr";

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div
        className="grid gap-4 bg-white px-6 py-5"
        style={{ gridTemplateColumns: cols }}
      >
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          DATE
        </div>
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          ODOMETER
        </div>
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          SOURCE
        </div>
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          RECORD TYPE
        </div>
        <div className="text-[14px] font-extrabold tracking-wide text-slate-800">
          DETAILS
        </div>
      </div>

      {/* Rows */}
      {sorted.map((it, idx) => {
        const date = formatYMD(it.DateYear, it.DateMonth, it.DateDay);
        const odo = it.OdometerDisplay || "—";

        const srcName = it.DataSource || "—";
        const srcLoc =
          it.Location?.LocationString &&
          it.Location.LocationString !== "Unknown"
            ? it.Location.LocationString
            : it.Location?.Country && it.Location.Country !== "Unknown"
            ? it.Location.Country
            : "Unknown";

        const recordType = it.TypeOfRecord || "—";

        // Split details into a bold lead line + bullet list (like the reference)
        const rawDetail = (it.Detail || "").trim();
        const lines = rawDetail
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
        const lead = lines[0] || "";
        const bullets = lines.slice(1);

        return (
          <div
            key={`${it.DateYear}-${it.DateMonth}-${it.DateDay}-${idx}`}
            className={[
              "border-t border-slate-200",
              idx % 2 === 1 ? "bg-sky-50/50" : "",
            ].join(" ")}
          >
            <div
              className="grid items-start gap-4 px-6 py-4"
              style={{ gridTemplateColumns: cols }}
            >
              {/* DATE */}
              <div className="text-[13px] font-semibold text-slate-700">
                {date}
              </div>

              {/* ODOMETER */}
              <div className="text-[13px] text-slate-600">{odo}</div>

              {/* SOURCE */}
              <div className="text-[13px] leading-6 text-slate-700">
                <div className="font-semibold">{srcName}</div>
                <div className="text-slate-600">{srcLoc}</div>
              </div>

              {/* RECORD TYPE */}
              <div className="text-[13px] text-slate-700">{recordType}</div>

              {/* DETAILS */}
              <div className="text-[13px] leading-6 text-slate-700">
                {lead && <div className="font-semibold">{lead}</div>}
                {!!bullets.length && (
                  <ul className="mt-1 list-disc pl-5">
                    {bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function jumpTo(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
