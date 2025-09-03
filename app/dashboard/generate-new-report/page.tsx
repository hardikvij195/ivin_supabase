// app/dashboard/generate-new-report/page.tsx
"use client";

import { Suspense } from "react";
import GenerateNewReport from "../_components/Generate-new-report";

export default function GenerateNewReportPage() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <GenerateNewReport />
    </Suspense>
  );
}
