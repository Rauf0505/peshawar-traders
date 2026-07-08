"use client";

import { Suspense } from "react";
import { ProductsPage } from "@/views/ProductsPage";

export default function ProductsListPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading products...</div>}>
      <ProductsPage />
    </Suspense>
  );
}
