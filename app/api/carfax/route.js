export async function POST(req) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 15_000);

  try {
    const { vin } = await req.json();

    // Basic VIN validation (17 chars, allowed charset 0-9 A-H J-N P R-Z)
    if (typeof vin !== "string" || !/^[A-HJ-NPR-Z0-9]{17}$/i.test(vin)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid VIN: must be 17 chars (no I, O, Q)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const upstream = await fetch("https://carfaxgo.com/api/v1/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CARFAX_API_TOKEN || ""}`,
      },
      body: JSON.stringify({ vin }),
      signal: abort.signal,
    });

    const raw = await upstream.text();
    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // keep raw text if not JSON
    }

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Upstream error ${upstream.status}`,
          details: parsed?.error || raw?.slice(0, 300),
        }),
        { status: upstream.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Try to normalize reportUrl
    let reportUrl =
      parsed?.reportUrl ||
      parsed?.url ||
      parsed?.location ||
      parsed?.data?.reportUrl;

    if (!reportUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "Upstream response missing reportUrl." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const u = new URL(reportUrl);
      if (!u.searchParams.has("lang")) u.searchParams.set("lang", "en");
      reportUrl = u.toString();
    } catch {
      // ignore invalid URL parse
    }

    return new Response(
      JSON.stringify({ success: true, vin, reportUrl }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const timedOut = err?.name === "AbortError";
    return new Response(
      JSON.stringify({
        success: false,
        error: timedOut ? "Request timed out." : "Internal server error",
      }),
      {
        status: timedOut ? 504 : 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    clearTimeout(timer);
  }
}
