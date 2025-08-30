// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const PAYPAL_BASE = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

async function getPaypalAccessToken() {
  const client = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${client}:${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Failed to get PayPal access token");
  const json = await res.json();
  return json.access_token as string;
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n) => cookieStore.get(n)?.value,
        set: (n, v, o) => { try { cookieStore.set({ name: n, value: v, ...o }); } catch {} },
        remove: (n, o) => { try { cookieStore.set({ name: n, value: "", ...o, maxAge: 0 }); } catch {} },
      },
    }
  );

  try {
    const { amount, returnUrl, cancelUrl } = await req.json();
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 });
    }

    // (optional) require auth
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = await getPaypalAccessToken();

    const createRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          { amount: { currency_code: "USD", value: n.toFixed(2) } }
        ],
        application_context: {
          return_url: returnUrl,  // where PayPal redirects after approval
          cancel_url: cancelUrl,  // where PayPal redirects if canceled
          user_action: "PAY_NOW",
        },
      }),
    });

    const order = await createRes.json();
    if (!createRes.ok || !order?.id) {
      return NextResponse.json(
        { success: false, error: order?.message || "PayPal create order failed" },
        { status: 400 }
      );
    }

    const approveLink: string | undefined = order.links?.find((l: any) => l.rel === "approve")?.href;
    if (!approveLink) {
      return NextResponse.json({ success: false, error: "No approve link from PayPal" }, { status: 400 });
    }

    return NextResponse.json({ success: true, orderId: order.id, approveUrl: approveLink });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e?.message || "Create order error" }, { status: 500 });
  }
}
