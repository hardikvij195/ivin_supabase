// /app/api/wallet/topup/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type Body =
  | { provider: "paypal"; orderId: string }
  | { provider?: "manual"; amount: number };

const PAYPAL_BASE =
  process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

async function getPaypalAccessToken() {
  const client = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${client}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Failed to get PayPal access token");
  const json = await res.json();
  return json.access_token as string;
}

/**
 * Capture and return { amount, currency, captureId }
 * If you prefer to only verify (no capture), switch to GET /v2/checkout/orders/{id}
 */
async function capturePaypalOrder(orderId: string) {
  const token = await getPaypalAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // empty body is fine; some SDKs send {}
      body: JSON.stringify({}),
    }
  );

  const json = await res.json();
  if (!res.ok) {
    const msg = json?.details?.[0]?.issue || json?.message || "PayPal capture failed";
    throw new Error(msg);
  }

  // Expecting status COMPLETED and at least one purchase unit with a capture
  if (json.status !== "COMPLETED") {
    throw new Error(`PayPal order not completed (status: ${json.status})`);
  }

  const pu = json.purchase_units?.[0];
  const cap = pu?.payments?.captures?.[0];
  const amountStr = cap?.amount?.value ?? pu?.amount?.value;
  const currency = cap?.amount?.currency_code ?? pu?.amount?.currency_code ?? "USD";
  const captureId = cap?.id ?? json.id;

  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid amount returned by PayPal");
  }

  return { amount, currency, captureId };
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try { cookieStore.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options: any) {
          try { cookieStore.set({ name, value: "", ...options, maxAge: 0 }); } catch {}
        },
      },
    }
  );

  try {
    const body = (await req.json()) as Body;

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Determine top-up source
    let creditedAmount = 0;
    let txId = "";
    let note = "Wallet top-up";

    if (body.provider === "paypal") {
      // 1) Capture PayPal order (server-side)
      const { amount, currency, captureId } = await capturePaypalOrder(
        body.orderId
      );
      creditedAmount = amount;
      txId = captureId;
      note = `PayPal top-up (${currency})`;
    } else {
      // "manual" (your existing flow)
      const n = Number((body as any).amount);
      if (!Number.isFinite(n) || n <= 0) {
        return NextResponse.json(
          { success: false, error: "Invalid amount" },
          { status: 400 }
        );
      }
      creditedAmount = n;
      txId = `top_${Math.random().toString(36).slice(2, 10)}`;
      note = "Wallet top-up";
    }

    // 2) Atomically credit wallet and add a transaction
    //    (If you created the SQL RPC wallet_topup from earlier, prefer it:)
    //
    // const { data: rpc, error: rpcErr } = await supabase.rpc("wallet_topup", {
    //   p_user_id: user.id,
    //   p_amount: creditedAmount,
    //   p_note: note,
    // });
    // if (rpcErr) throw rpcErr;
    // const txn = Array.isArray(rpc) ? rpc[0] : rpc;
    // return NextResponse.json({
    //   success: true,
    //   txId: txn.tx_id,
    //   balance: Number(txn.balance_after),
    //   txn,
    // });
    //
    // If you don't want to add the RPC yet, use your upsert+insert sequence:

    // read current
    const { data: w } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    const current = Number((w as any)?.balance ?? 0) || 0;
    const next = current + creditedAmount;

    // upsert wallet
    const { error: upErr } = await supabase
      .from("wallets")
      .upsert({ user_id: user.id, balance: next }, { onConflict: "user_id" });
    if (upErr) throw upErr;

    // add wallet transaction
    const { error: txErr } = await supabase.from("wallet_transactions").insert({
      user_id: user.id,
      type: "topup",
      amount: String(creditedAmount),
      status: "success",
      tx_id: txId,
      note,
      balance_after: String(next),
    });
    if (txErr) throw txErr;

    return NextResponse.json({ success: true, txId, balance: next });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: e?.message || "Topup error" },
      { status: 500 }
    );
  }
}
