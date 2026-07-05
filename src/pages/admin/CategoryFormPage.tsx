import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { createCategory, updateCategory, getCategories } from "@/lib/api/products.server";
import { toast } from "sonner";

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
            displayOrder: cat.display_order || 0,
            status: cat.status ?? 1,
          });
          setSlugManuallyEdited(true);
        }
        setLoading(false);
      });
    }
  }, [editId]);

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
      if (isEdit) {
        await updateCategory({ data: { token: getToken(), id: editId!, ...form } });
      } else {
        await createCategory({ data: { token: getToken(), ...form } });
      }
      toast.success(isEdit ? "Category updated successfully" : "Category created successfully");
      router.navigate({ to: "/admin/categories" });
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
            <p className="text-xs text-zinc-600 mt-1">Used in URLs: /shop/{form.slug || "…"}</p>
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
            onClick={() => router.navigate({ to: "/admin/categories" })}
            className="px-5 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition text-zinc-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
