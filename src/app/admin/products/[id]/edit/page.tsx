"use client";

import { useParams } from "next/navigation";
import { ProductFormPage } from "@/views/admin/ProductFormPage";

export default function EditProduct() {
  const params = useParams();
  return <ProductFormPage editId={Number(params.id)} />;
}
