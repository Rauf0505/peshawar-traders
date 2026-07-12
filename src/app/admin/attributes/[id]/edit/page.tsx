"use client";

import { use } from "react";
import { AttributeFormPage } from "@/views/admin/AttributeFormPage";

export default function EditAttribute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <AttributeFormPage editId={Number(id)} />;
}
