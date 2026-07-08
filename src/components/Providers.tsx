"use client";

import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "@/components/site/CartDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <Toaster richColors closeButton />
    </CartProvider>
  );
}
