"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface ReportType {
  id: string;
  report_name: string;
  amount: number | string;
}

export default function GenerateNewReport() {
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>("");

  const [vin, setVin] = useState("");
  const [note, setNote] = useState("");
  const [shareToWall, setShareToWall] = useState(false);

  // modal/flow
  const [openConfirm, setOpenConfirm] = useState(false);
  const [inlineMsg, setInlineMsg] = useState<string | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // helpers
  const formatPrice = (v: number | string | undefined | null) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      Number(v) || 0
    );

  const selected = useMemo(
    () => reportTypes.find((r) => r.id === selectedReport),
    [reportTypes, selectedReport]
  );

  const selectedAmount = useMemo(
    () => (Number.isFinite(Number(selected?.amount)) ? Number(selected?.amount) : 20),
    [selected?.amount]
  );

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseBrowser
        .from("report-details")
        .select("id, report_name, amount");
      if (error) {
        console.error("Error fetching report types:", error);
        setReportTypes([]);
        return;
      }
      const normalized =
        (data ?? []).map((r: any) => ({
          ...r,
          amount: Number(r.amount),
        })) as ReportType[];
      setReportTypes(normalized);
    })();
  }, []);

  const isValidVin = (s: string) => /^[A-HJ-NPR-Z0-9]{17}$/i.test(s.trim());

  const handleSearchClick = () => {
    setInlineMsg(null);
    if (!vin.trim()) return setInlineMsg("Please enter a VIN.");
    if (!isValidVin(vin)) return setInlineMsg("Invalid VIN. It must be 17 characters (no I, O, Q).");
    if (!Number.isFinite(selectedAmount) || selectedAmount <= 0)
      return setInlineMsg("Selected report has no valid price configured.");
    setOpenConfirm(true);
  };

  const handleConfirmCharge = async () => {
    setConfirmError(null);
    setConfirmBusy(true);

    let txId: string | undefined;
    let paymentId: string | undefined;

    const vinUpper = vin.trim().toUpperCase();
    const finalReportType = selected?.report_name || "Full Report";
    const finalAmount = selectedAmount;

    try {
      // 0) user session
      const {
        data: { user },
        error: userErr,
      } = await supabaseBrowser.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error("No user session. Please sign in again.");

      // 1) Create a PENDING payment row
      {
        const { data: inserted, error: pendErr } = await supabaseBrowser
          .from("payments")
          .insert([
            {
              user_id: user.id,
              vin: vinUpper,
              method: "wallet",
              status: "pending",
              report_type: finalReportType,
              amount: String(finalAmount),
              // optional: note, share_to_wall if your table has them
              // note,
              // share_to_wall: shareToWall
            },
          ])
          .select("id")
          .single();

        if (pendErr) throw pendErr;
        paymentId = inserted?.id;
      }

      // 2) CHARGE WALLET (replace with your wallet impl)
      {
        const res = await fetch("/api/wallet/charge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalAmount,
            currency: "USD",
            reason: `Carfax ${vinUpper} - ${finalReportType}`,
            metadata: { vin: vinUpper, reportType: finalReportType },
          }),
        });
        const charge = await res.json();
        if (!res.ok || !charge?.success) {
          // mark payment canceled
          if (paymentId) {
            await supabaseBrowser.from("payments").update({ status: "canceled" }).eq("id", paymentId);
          }
          throw new Error(charge?.error || "Wallet charge failed.");
        }
        txId = charge?.txId;

        // mark payment success + store txId if you track it
        if (paymentId) {
          await supabaseBrowser
            .from("payments")
            .update({ status: "success", tx_id: txId || null })
            .eq("id", paymentId);
        }
      }

      // 3) CALL CARFAX API
      const res = await fetch("/api/carfax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vin: vinUpper }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success || !payload?.reportUrl) {
        throw new Error(payload?.error || "Failed to create Carfax report.");
      }

      // reportId from the Carfax URL
      const carfaxUrl = new URL(payload.reportUrl);
      const reportId = carfaxUrl.searchParams.get("id");
      if (!reportId) throw new Error("No report ID in Carfax URL.");

      // 4) FETCH FULL JSON
      const json_url = `/api/proxyCarfaxJson?id=${encodeURIComponent(reportId)}`;
      let dataJson: any = null;
      try {
        const j = await fetch(json_url, { cache: "no-store" });
        dataJson = await j.json();
      } catch (e) {
        console.warn("JSON fetch failed:", e);
      }

      // 5) Build URLs & save carfax_reports
      const original_pdf_url = `https://carfaxgo.com/carfax?id=${encodeURIComponent(reportId)}`;
      const vinx_pdf_url = `${window.location.origin}/report?id=${encodeURIComponent(reportId)}`;

      const { error: insertErr } = await supabaseBrowser
        .from("carfax_reports")
        .insert([
          {
            user_id: user.id,
            vin: vinUpper,
            report_url: original_pdf_url, // canonical view URL
            data: dataJson ?? null,
            report_id: reportId,
            json_url,
            original_pdf_url,
            vinx_pdf_url,
            report_type: finalReportType,
            amount: String(finalAmount),
            add_wall: shareToWall, 
          },
        ]);

      if (insertErr) throw insertErr;

      // 6) OPEN REPORT
      setOpenConfirm(false);
      window.open(vinx_pdf_url, "_blank");
    } catch (err: any) {
      console.error(err);
      setConfirmError(err?.message || "Something went wrong. Please try again.");

      if (txId) {
        try {
          await fetch("/api/wallet/refund", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ txId }),
          });
        } catch (e) {
          console.warn("Refund attempt failed:", e);
        }
      }
      if (paymentId) {
        await supabaseBrowser.from("payments").update({ status: "canceled" }).eq("id", paymentId);
      }
    } finally {
      setConfirmBusy(false);
    }
  };

  return (
    <div>
      <p className="font-fredoka font-semibold text-[24px] mt-5 text-[#1C1C1C] mb-3 px-2">
        Generate New Vehicle Report
      </p>

      <div className="p-8 bg-white w-full border border-[#EAEAEA] rounded-[8px] flex flex-col gap-4">
        {/* VIN/Plate */}
        <div className="mb-3">
          <p className="text-[16px] font-medium mb-3">Enter your 17-character VIN or Plate Number</p>
          <div className="flex gap-5 justify-between">
            <Input
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="bg-[#FAFAFA] px-4 py-2 border border-[#E4E4E4] focus:outline-primary rounded-full w-full"
              placeholder="e.g. 1HGCM82633A004352"
            />
            
          </div>
          {inlineMsg && <div className="mt-3 text-sm text-slate-700">{inlineMsg}</div>}
        </div>

        {/* Report type select */}
        {/*<div className="mb-3">
          <p className="text-[16px] font-medium mb-3">Select Report Type</p>
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-full rounded-3xl bg-white border border-gray-200 px-4 py-3 text-left">
              {selected ? (
                <div className="flex w-full items-center justify-between">
                  <span>{selected.report_name}</span>
                  <span className="text-[#5E189D] font-semibold">
                    {formatPrice(selected.amount ?? 20)}
                  </span>
                </div>
              ) : (
                <SelectValue placeholder="Choose the type of report" />
              )}
            </SelectTrigger>
            <SelectContent className="bg-white rounded-[8px] border border-gray-200 shadow-md">
              <SelectGroup>
                {reportTypes.map((report) => (
                  <SelectItem key={report.id} value={report.id}>
                    <div className="flex w-full items-center justify-between">
                      <span>{report.report_name}</span>
                      <span className="text-[#5E189D] font-semibold">
                        {formatPrice(report.amount)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}

        {/* Share toggle */}
        <div className="flex justify-between gap-2 mb-3">
          <p className="text-[16px] font-medium">Share VIN Report to The Wall page</p>
          <Switch checked={shareToWall} onCheckedChange={setShareToWall} />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <p className="text-[16px] font-medium mb-3">Add Notes</p>
          <div className="flex gap-5 justify-between">
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-[#FAFAFA] px-8 py-4 border border-[#E4E4E4] focus:outline-primary rounded-full w-full"
              placeholder="Optional notes about this report"
            />
          </div>
        </div>

        {/* Important notes */}
        <div className="mb-6 px-6 py-[12px] bg-[#FFFEDE] border-l-4 border-l-[#F8BD00] flex flex-col gap-[10px]">
          <p className="font-medium">Important Notes:</p>
          <p className="text-[#4D4D4D]">- You must enter a valid 17-digit VIN to proceed.</p>
          <p className="text-[#4D4D4D]">- Reports are non-refundable once generated.</p>
        </div>

        {/* Primary CTA */}
        <Button
          onClick={handleSearchClick}
          className="font-fredoka text-white bg-primary font-semibold rounded-full w-full whitespace-nowrap disabled:opacity-50"
        >
          Get Reports
        </Button>
      </div>

      {/* Confirm Charge Modal */}
      <Dialog open={openConfirm} onOpenChange={(o) => !confirmBusy && setOpenConfirm(o)}>
        <DialogContent className="sm:max-w-[460px] bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Charge</DialogTitle>
           <DialogDescription>
  <>
    You&apos;re about to purchase{" "}
    <b>{selected?.report_name || "Full Report"}</b> for VIN{" "}
    <b>{vin.toUpperCase()}</b>.
  </>
</DialogDescription>

          </DialogHeader>

          <div className="mt-2 text-base">
            Amount to charge from your wallet:{" "}
            <span className="font-semibold text-[#5E189D]">{formatPrice(selectedAmount)}</span>
          </div>

          {confirmError && <div className="mt-3 text-sm text-red-600">{confirmError}</div>}

          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <DialogClose asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={confirmBusy}>
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleConfirmCharge}
              className="bg-[#5E189D] hover:bg-[#4a1387] text-white"
              disabled={confirmBusy}
            >
              {confirmBusy ? "Processing…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
