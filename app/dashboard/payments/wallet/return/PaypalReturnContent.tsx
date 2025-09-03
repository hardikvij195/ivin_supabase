// app/dashboard/payments/wallet/return/PaypalReturnContent.tsx
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
import { CheckCircle2, XCircle } from "lucide-react";
import Loader from "../../../../(auth)/callback/loading";

export default function PaypalReturnContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState("Processing your payment…");
  const [ok, setOk] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const token = sp.get("token");
    if (!token) {
      setMessage("Missing PayPal token.");
      setOk(false);
      setShowModal(true);
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
        setShowModal(true);
      } catch (e: any) {
        console.error(e);
        setOk(false);
        setMessage(e?.message || "Payment capture failed.");
        setShowModal(true);
      }
    })();
  }, [sp]);

  const handleClose = () => {
    setShowModal(false);
    router.push("/dashboard/payments/wallet");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Loader />

      <Dialog open={showModal} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[420px] bg-white z-50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {ok ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Payment successful
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  Payment failed
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2 text-base">
            {ok ? (
              amount != null ? (
                <>
                  We received <b>${amount.toFixed(2)}</b>. Your wallet has been
                  updated.
                </>
              ) : (
                <>Your wallet has been updated.</>
              )
            ) : (
              <>{message}</>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button
              className={`${
                ok
                  ? "bg-purple-700 hover:bg-purple-800"
                  : "bg-red-600 hover:bg-red-700"
              } text-white`}
              onClick={handleClose}
            >
              {ok ? "Okay!" : "Go back"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
