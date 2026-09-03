"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/stores/appStore";

export function useCaptureQuery() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const capture = searchParams.get("capture");
    const type = searchParams.get("type");
    if (capture === "1") {
      if (type === "task" || type === "note") {
        useAppStore.getState().setCaptureType(type === "task" ? "task" : "note");
      } else {
        useAppStore.getState().setCaptureType("auto");
      }
      useAppStore.getState().openQuickCapture();
    }
  }, [searchParams]);
}
