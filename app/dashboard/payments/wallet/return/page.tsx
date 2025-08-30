// app/dashboard/payments/wallet/return/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

export default function PaypalReturnPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState("Processing your payment…");
  const [done, setDone] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);

  // modal state + amount for display
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const token = sp.get("token"); // PayPal sends ?token=<orderId>
    if (!token) {
      setMessage("Missing PayPal token.");
      setOk(false);
      setDone(true);
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/wallet/topup", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "paypal", orderId: token }),
        });
        const json = await res.json();

        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Capture failed");
        }

        // Try to pull the credited amount from the API response.
        // Support multiple shapes: {amount}, {credited}, or {txn: { amount }}.
        const credited =
          typeof json.amount === "number"
            ? json.amount
            : typeof json.credited === "number"
            ? json.credited
            : json.txn && typeof json.txn.amount !== "undefined"
            ? Number(json.txn.amount)
            : null;

        setAmount(
          credited != null && !Number.isNaN(Number(credited))
            ? Number(credited)
            : null
        );

        setOk(true);
        setMessage("Payment successful! Your wallet has been updated.");
        setShowSuccessModal(true); // open success modal
      } catch (e: any) {
        console.error(e);
        setOk(false);
        setMessage(e?.message || "Payment capture failed.");
      } finally {
        setDone(true);
      }
    })();
  }, [sp]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">PayPal</h1>
      <p className={`mb-6 ${ok === false ? "text-red-600" : "text-gray-800"}`}>
        {message}
      </p>

      {/* Success Modal (only when capture succeeded) */}
     <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
  {/* Custom overlay with blur */}
  <div className="fixed inset-0 z-40 bg-white/30 backdrop-blur-md" />

  <DialogContent className="sm:max-w-[420px] bg-white z-50">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
        Payment successful
      </DialogTitle>
    </DialogHeader>

    <div className="mt-2 text-base">
      {amount != null ? (
        <>We received <b>${amount.toFixed(2)}</b>. Your wallet has been updated.</>
      ) : (
        <>Your wallet has been updated.</>
      )}
    </div>

    <DialogFooter className="mt-6">
      <Button
        className="bg-purple-700 hover:bg-purple-800 text-white"
        onClick={() => router.push("/dashboard/payments/wallet")}
      >
        Okay!
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
