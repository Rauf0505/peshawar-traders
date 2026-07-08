"use client";

import { useParams } from "next/navigation";
import { SubcategoryFormPage } from "@/views/admin/SubcategoryFormPage";

export default function EditSubcategory() {
  const params = useParams();
  return <SubcategoryFormPage editId={Number(params.id)} />;
}
