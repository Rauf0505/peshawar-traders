"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/site/CartDrawer";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <CartDrawer />
        <Toaster richColors closeButton />
      </QueryClientProvider>
    </CartProvider>
  );
}
