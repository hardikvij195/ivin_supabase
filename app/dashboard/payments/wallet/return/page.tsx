// app/dashboard/payments/wallet/return/page.tsx
"use client";

import { Suspense } from "react";
import PaypalReturnContent from "./PaypalReturnContent";

export default function PaypalReturnPage() {
  return (
    <Suspense fallback={<div>Loading payment page…</div>}>
      <PaypalReturnContent />
    </Suspense>
  );
}
