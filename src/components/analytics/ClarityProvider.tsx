"use client";

import { useEffect, useRef } from "react";
import Clarity from "@microsoft/clarity";

export function ClarityProvider() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      Clarity.init("xnn60myh6y");
      isInitialized.current = true;
    }
  }, []);

  return null;
}
