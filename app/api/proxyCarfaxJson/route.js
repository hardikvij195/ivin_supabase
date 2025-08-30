// app/api/proxyCarfaxJson/route.js
export async function GET(req) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), 15_000);

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing report ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const upstream = await fetch(`https://www.carfaxgo.com/Json/GetData?id=${id}`, {
      method: "GET",
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

    // If JSON parsed fine, return it. Otherwise return raw text.
    return new Response(
      JSON.stringify(parsed ?? { raw }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const timedOut = err?.name === "AbortError";
    return new Response(
      JSON.stringify({
        success: false,
        error: timedOut ? "Request timed out." : "Failed to fetch JSON",
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
