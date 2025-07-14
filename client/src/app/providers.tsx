// store/provider.ts
"use client";
import { Toaster } from "sonner";

import StoreProvider from "./redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
      <Toaster position="top-right" theme="dark" />
    </StoreProvider>
  );
}
