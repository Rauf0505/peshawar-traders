"use client";

import { useParams } from "next/navigation";
import { CategoryFormPage } from "@/views/admin/CategoryFormPage";

export default function EditCategory() {
  const params = useParams();
  return <CategoryFormPage editId={Number(params.id)} />;
}
