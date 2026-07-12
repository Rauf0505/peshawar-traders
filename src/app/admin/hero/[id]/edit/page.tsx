"use client";

import { use } from "react";
import { HeroFormPage } from "@/views/admin/HeroFormPage";

export default function EditHeroSlide({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <HeroFormPage editId={Number(id)} />;
}
