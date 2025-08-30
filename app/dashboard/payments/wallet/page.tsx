"use client";

import { useEffect, useMemo, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { Plus, Wallet, History, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Link from "next/link";

type WalletRow = {
  user_id: string;
  balance: number | string | null;
  updated_at?: string | null;
};

type Txn = {
  id: string;
  created_at: string;
  user_id: string;
  type: "topup" | "debit" | "refund" | string;
  amount: number | string;
  status: "pending" | "success" | "failed" | string;
  note?: string | null;
  tx_id?: string | null;
  balance_after?: number | string | null;
};

// normalize status for display
const normalizeStatus = (s: string) => {
  const v = (s || "").toLowerCase();
  if (["failed", "rejected", "declined"].includes(v)) return "Rejected";
  if (v === "success" || v === "succeeded") return "Success";
  if (v === "pending") return "Pending";
  if (v === "canceled" || v === "cancelled") return "Canceled";
  return s || "—";
};

export default function WalletPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [balance, setBalance] = useState(0);
  const [txns, setTxns] = useState<Txn[]>([]);

  const [openTopup, setOpenTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState<string>("20");
  const [topupBusy, setTopupBusy] = useState(false);
  const [topupError, setTopupError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabaseBrowser.auth.getUser();
        if (userError) throw userError;
        if (!user) throw new Error("No user.");

        const [{ data: w, error: wErr }, { data: t, error: tErr }] =
          await Promise.all([
            supabaseBrowser
              .from("wallets")
              .select("balance")
              .eq("user_id", user.id)
              .single(),
            supabaseBrowser
              .from("wallet_transactions")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false }),
          ]);

        if (wErr && wErr.code !== "PGRST116") throw wErr;
        if (tErr) throw tErr;

        if (!cancelled) {
          setBalance(Number((w as WalletRow | null)?.balance ?? 0) || 0);
          setTxns((t ?? []) as Txn[]);
        }
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setErr(e?.message || "Failed to load wallet.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onTopup() {
  setTopupError(null);
  setTopupBusy(true);
  try {
    const amt = Number(topupAmount);
    if (!Number.isFinite(amt) || amt <= 0) throw new Error("Enter a valid amount.");

    const origin = window.location.origin;
    const returnUrl = `${origin}/dashboard/payments/wallet/return`;
    const cancelUrl = `${origin}/dashboard/payments/wallet`;

    // 1) Ask backend to create the PayPal order for this amount
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt, returnUrl, cancelUrl }),
    });
    const json = await res.json();
    if (!res.ok || !json?.approveUrl) {
      throw new Error(json?.error || "Could not create PayPal order.");
    }

    // 2) Redirect the user to PayPal approval page
    window.location.href = json.approveUrl;
    // NOTE: After approval, PayPal will redirect the user to returnUrl with ?token=<orderId>
    // Our return page will capture it and credit the wallet.
  } catch (e: any) {
    console.error(e);
    setTopupError(e?.message || "Could not start PayPal checkout.");
  } finally {
    setTopupBusy(false);
  }
}


  return (
    <div className="lg:max-w-full md:max-w-full max-w-[320px]">
      <Link href='/dashboard/payments'><MoveLeft  className="w-5 h-5 my-5 text-gray-600 "/></Link>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Wallet</h1>
        <Button
          onClick={() => setOpenTopup(true)}
          className="bg-purple-700 hover:bg-purple-800 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add cash
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-3">
          <div className="rounded-lg bg-purple-600/10 p-2">
            <Wallet className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Current Balance</div>
            <div className="text-xl font-semibold">
              {loading ? "…" : `$${balance.toFixed(2)}`}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center gap-3">
          <div className="rounded-lg bg-slate-600/10 p-2">
            <History className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Transactions</div>
            <div className="text-xl font-semibold">
              {loading ? "…" : txns.length}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-sm text-gray-500 mb-1">Quick Add</div>
          <div className="flex gap-2">
            {[10, 20, 50].map((v) => (
              <Button
                key={v}
                variant="outline"
                onClick={() => {
                  setTopupAmount(String(v));
                  setOpenTopup(true);
                }}
              >
                ${v}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {/* History Table */}
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-700">
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">TX</th>
              <th className="p-3">Note</th>
              <th className="p-3">Balance After</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="p-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : txns.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No wallet transactions found.
                </td>
              </tr>
            ) : (
              txns.map((t) => {
                const s = (t.status || "").toLowerCase();
                const statusClass = ["failed", "rejected", "declined"].includes(
                  s
                )
                  ? "text-red-600"
                  : s === "success" || s === "succeeded"
                  ? "text-green-600"
                  : s === "pending"
                  ? "text-amber-600"
                  : "";
                return (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 capitalize">{t.type}</td>
                    <td className="p-3">${Number(t.amount ?? 0).toFixed(2)}</td>
                    <td className={`p-3 capitalize ${statusClass}`}>
                      {normalizeStatus(t.status)}
                    </td>
                   
                    <td className="p-3 font-mono">
                      {t.tx_id ? `${t.tx_id.slice(0, 8)}…` : "—"}
                    </td>
                    <td className="p-3">{t.note || "—"}</td>
                     <td className="p-3">
                      {t.balance_after != null
                        ? `$${Number(t.balance_after).toFixed(2)}`
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Cash Modal */}
      <Dialog
        open={openTopup}
        onOpenChange={(o) => !topupBusy && setOpenTopup(o)}
      >
        <DialogContent className="sm:max-w-[420px] bg-white">
          <DialogHeader>
            <DialogTitle>Add cash to wallet</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <label className="text-sm text-gray-700">Amount (USD)</label>
            <Input
              type="number"
              min={1}
              step={1}
              value={topupAmount}
              onChange={(e) => setTopupAmount(e.target.value)}
            />
            {topupError && (
              <div className="text-sm text-red-600">{topupError}</div>
            )}
          </div>

          <DialogFooter className="mt-6 flex gap-3 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" disabled={topupBusy}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={onTopup}
              className="bg-purple-700 hover:bg-purple-800 text-white"
              disabled={topupBusy}
            >
              {topupBusy ? "Processing…" : "Add cash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
