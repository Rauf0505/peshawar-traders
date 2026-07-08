"use client";

import { useParams } from "next/navigation";
import { BrandFormPage } from "@/views/admin/BrandFormPage";

export default function EditBrand() {
  const params = useParams();
  return <BrandFormPage editId={Number(params.id)} />;
}
