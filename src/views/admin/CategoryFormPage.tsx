"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory, getCategories, getAttributes, getCategoryAttributes, setCategoryAttributes } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

interface FormData {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  status: number;
}

const emptyForm: FormData = {
  name: "", slug: "", description: "", displayOrder: 0, status: 1,
};

interface Props {
  editId?: number;
}

export function CategoryFormPage({ editId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [allAttributes, setAllAttributes] = useState<any[]>([]);
  const [categoryAttributeIds, setCategoryAttributeIds] = useState<Set<number>>(new Set());
  const [attributeSettings, setAttributeSettings] = useState<Record<number, { sortOrder: number; showInFilter: number }>>({});
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [attributesInitialized, setAttributesInitialized] = useState(false);

  const isEdit = !!editId;

  const clearFieldError = (field: string) => setFieldErrors((prev) => ({ ...prev, [field]: "" }));

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Category name is required";
    if (!form.slug.trim()) errors.slug = "Slug is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) setError("Please fix the highlighted fields.");
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (isEdit && editId) {
      getCategories().then((cats: any[]) => {
        const cat = cats.find((c: any) => c.id === editId);
        if (cat) {
          setForm({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            displayOrder: cat.displayOrder || 0,
            status: cat.status ?? 1,
          });
          setSlugManuallyEdited(true);
        }
        setLoading(false);
      });
    }
  }, [editId]);

  useEffect(() => {
    if (attributesInitialized) return;
    getAttributes().then((attrs: any[]) => {
      setAllAttributes(attrs);
      if (isEdit && editId) {
        getCategoryAttributes({ data: { categoryId: editId } }).then((assigned: any[]) => {
          const ids = new Set<number>();
          const settings: Record<number, { sortOrder: number; showInFilter: number }> = {};
          assigned.forEach((a: any) => {
            ids.add(a.attributeId);
            settings[a.attributeId] = { sortOrder: a.sortOrder ?? 0, showInFilter: a.showInFilter ?? 0 };
          });
          setCategoryAttributeIds(ids);
          setAttributeSettings(settings);
          setLoadingAttributes(false);
        });
      }
      setAttributesInitialized(true);
      setLoadingAttributes(false);
    });
  }, [isEdit, editId, attributesInitialized]);

  const toggleAttribute = (attrId: number) => {
    setCategoryAttributeIds((prev) => {
      const next = new Set(prev);
      if (next.has(attrId)) next.delete(attrId);
      else next.add(attrId);
      return next;
    });
    if (!attributeSettings[attrId]) {
      setAttributeSettings((prev) => ({ ...prev, [attrId]: { sortOrder: 0, showInFilter: 0 } }));
    }
  };

  const updateAttrSetting = (attrId: number, field: "sortOrder" | "showInFilter", value: number) => {
    setAttributeSettings((prev) => ({
      ...prev,
      [attrId]: { ...prev[attrId], [field]: value },
    }));
  };

  const update = (field: keyof FormData, value: any) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "name" && !slugManuallyEdited) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      let catId: number;
      if (isEdit) {
        await updateCategory({ data: { token: getToken(), id: editId!, ...form } });
        catId = editId!;
      } else {
        const result = await createCategory({ data: { token: getToken(), ...form } });
        catId = result.id;
      }

      await setCategoryAttributes({
        data: {
          token: getToken(),
          categoryId: catId,
          assignments: Array.from(categoryAttributeIds).map((attrId) => ({
            attributeId: attrId,
            sortOrder: attributeSettings[attrId]?.sortOrder ?? 0,
            showInFilter: attributeSettings[attrId]?.showInFilter ?? 0,
          })),
        },
      });

      toast.success(isEdit ? "Category updated successfully" : "Category created successfully");
      router.push("/admin/categories");
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (field: string) => `w-full h-10 px-3 bg-zinc-900 border ${fieldErrors[field] ? "border-red-500" : "border-zinc-800"} rounded-md text-sm text-zinc-100 focus:outline-none ${fieldErrors[field] ? "focus:border-red-400" : "focus:border-emerald-500"} transition`;
  const labelCls = "block text-xs uppercase tracking-wider text-zinc-500 mb-1.5";

  if (loading) return <div className="p-6 text-zinc-500 text-sm">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-lg font-display font-medium mb-6">
        {isEdit ? "Edit Category" : "New Category"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Category Name *</label>
            <input
              value={form.name}
              onChange={(e) => { clearFieldError("name"); update("name", e.target.value); }}
              className={inputCls("name")}
              placeholder="e.g. Optics & Lasers"
              required
            />
            {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => { clearFieldError("slug"); setSlugManuallyEdited(true); update("slug", e.target.value); }}
              className={inputCls("slug")}
              placeholder="e.g. optics-lasers"
              required
            />
            {fieldErrors.slug && <p className="text-xs text-red-400 mt-1">{fieldErrors.slug}</p>}
            <p className="text-xs text-zinc-600 mt-1">Used in URLs: /products?category={form.slug || "…"}</p>
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
            placeholder="Brief category description…"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Display Order</label>
            <input
              type="number"
              min={0}
              value={form.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
              className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", Number(e.target.value))}
              className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
            >
              <option value={1}>Active</option>
              <option value={0}>Disabled</option>
            </select>
          </div>
        </div>

        <div className="border border-zinc-800 rounded-lg p-5">
          <h3 className="text-sm font-medium text-zinc-100 mb-4">Category Attributes</h3>
          <p className="text-xs text-zinc-500 mb-4">Assign attributes that products in this category can have.</p>
          {loadingAttributes ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading attributes…
            </div>
          ) : allAttributes.length === 0 ? (
            <p className="text-xs text-zinc-600">No attributes defined yet. <Link href="/admin/attributes/new" className="text-emerald-400 hover:underline">Create one</Link>.</p>
          ) : (
            <div className="space-y-2">
              {allAttributes.map((attr) => {
                const assigned = categoryAttributeIds.has(attr.id);
                const settings = attributeSettings[attr.id];
                return (
                  <div key={attr.id} className="flex items-center gap-3 p-2 rounded hover:bg-zinc-900/50 transition">
                    <input
                      type="checkbox"
                      checked={assigned}
                      onChange={() => toggleAttribute(attr.id)}
                      className="accent-emerald-500"
                      id={`attr-${attr.id}`}
                    />
                    <label htmlFor={`attr-${attr.id}`} className="flex-1 text-sm text-zinc-300 cursor-pointer">
                      {attr.name}
                      <span className="text-xs text-zinc-600 ml-2">({attr.type})</span>
                    </label>
                    {assigned && (
                      <>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-zinc-500">Order</label>
                          <input
                            type="number"
                            min={0}
                            value={settings?.sortOrder ?? 0}
                            onChange={(e) => updateAttrSetting(attr.id, "sortOrder", Number(e.target.value))}
                            className="w-16 h-8 px-2 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 text-xs text-zinc-500 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings?.showInFilter === 1}
                            onChange={(e) => updateAttrSetting(attr.id, "showInFilter", e.target.checked ? 1 : 0)}
                            className="accent-emerald-500"
                          />
                          Filter
                        </label>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-400 bg-red-950/50 px-3 py-2 rounded-md">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium rounded-md transition text-white"
          >
            {saving ? "Saving…" : isEdit ? "Update Category" : "Create Category"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/categories")}
            className="px-5 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition text-zinc-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
