"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAttributeById,
  createAttribute,
  updateAttribute,
  getAttributeOptions,
  createAttributeOption,
  updateAttributeOption,
  deleteAttributeOption,
} from "@/lib/api-client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

interface Option {
  id?: number;
  value: string;
  hex?: string;
  sortOrder: number;
}

const attrTypes = [
  { value: "text", label: "Text (free input)" },
  { value: "select", label: "Select (dropdown)" },
  { value: "color_swatch", label: "Color Swatch" },
];

interface Props {
  editId?: number;
}

export function AttributeFormPage({ editId }: Props) {
  const router = useRouter();
  const isEdit = !!editId;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("text");
  const [isVariantDefining, setIsVariantDefining] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = editId;
    if (isEdit && id) {
      getAttributeById({ data: { id } }).then((a: any) => {
        setName(a.name || "");
        setSlug(a.slug || "");
        setType(a.type || "text");
        setIsVariantDefining(a.isVariantDefining === 1);
        setSortOrder(a.sortOrder ?? 0);
        if (a.type === "select" || a.type === "color_swatch") {
          getAttributeOptions({ data: { attributeId: id } }).then((opts: any[]) => {
            setOptions(opts.map((o: any) => ({
              id: o.id,
              value: o.value,
              hex: o.meta ? JSON.parse(o.meta).hex || "" : "",
              sortOrder: o.sortOrder ?? 0,
            })));
          });
        }
        setLoading(false);
      });
    }
  }, [editId]);

  const addOption = () => {
    setOptions([...options, { value: "", hex: type === "color_swatch" ? "#000000" : "", sortOrder: options.length }]);
  };

  const updateOption = (i: number, field: keyof Option, val: any) => {
    const copy = [...options];
    (copy[i] as any)[field] = val;
    setOptions(copy);
  };

  const removeOption = (i: number) => {
    const opt = options[i];
    if (opt.id) {
      deleteAttributeOption({ data: { token: getToken(), id: opt.id } }).catch(() => {});
    }
    setOptions(options.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = {
        token: getToken(),
        name: name.trim(),
        slug: slug.trim(),
        type,
        isVariantDefining: isVariantDefining ? 1 : 0,
        sortOrder,
      };

      let attrId: number;
      if (isEdit && editId) {
        await updateAttribute({ data: { ...payload, id: editId } });
        attrId = editId;
      } else {
        const result = await createAttribute({ data: payload });
        attrId = result.id;
      }

      if ((type === "select" || type === "color_swatch") && attrId) {
        for (const opt of options) {
          if (!opt.value.trim()) continue;
          const meta = type === "color_swatch" && opt.hex ? JSON.stringify({ hex: opt.hex }) : undefined;
          if (opt.id) {
            await updateAttributeOption({ data: { token: getToken(), id: opt.id, value: opt.value, meta, sortOrder: opt.sortOrder } });
          } else {
            await createAttributeOption({ data: { token: getToken(), attributeId: attrId, value: opt.value, meta, sortOrder: opt.sortOrder } });
          }
        }
      }

      toast.success(isEdit ? "Attribute updated" : "Attribute created");
      router.push("/admin/attributes");
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (val: string) => {
    if (!isEdit) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  const inputCls = "w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition";
  const labelCls = "block text-xs uppercase tracking-wider text-zinc-500 mb-1.5";

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-lg font-display font-medium text-zinc-100">
          {isEdit ? "Edit Attribute" : "New Attribute"}
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {isEdit ? "Update the attribute" : "Define a reusable product attribute"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name</label>
            <input value={name} onChange={(e) => { setName(e.target.value); generateSlug(e.target.value); }} className={inputCls} placeholder="e.g. Caliber" required />
          </div>
          <div>
            <label className={labelCls}>Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputCls} placeholder="caliber" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
              {attrTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sort Order</label>
            <input type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls} />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isVariantDefining} onChange={(e) => setIsVariantDefining(e.target.checked)} className="accent-emerald-500" />
          <span className="text-sm text-zinc-300">Variant-defining (this attribute creates product variants)</span>
        </label>

        {(type === "select" || type === "color_swatch") && (
          <div className="border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-100">
                {type === "color_swatch" ? "Color Options" : "Options"}
              </h3>
              <button type="button" onClick={addOption} className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition">
                <Plus className="h-3.5 w-3.5" /> Add Option
              </button>
            </div>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  {type === "color_swatch" && (
                    <input
                      type="color"
                      value={opt.hex || "#000000"}
                      onChange={(e) => updateOption(i, "hex", e.target.value)}
                      className="h-9 w-9 rounded cursor-pointer bg-zinc-900 border border-zinc-800"
                    />
                  )}
                  <input
                    type="text"
                    value={opt.value}
                    onChange={(e) => updateOption(i, "value", e.target.value)}
                    className="flex-1 h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
                    placeholder={type === "color_swatch" ? "Black" : "Option value"}
                  />
                  <button type="button" onClick={() => removeOption(i)} className="grid h-8 w-8 place-items-center rounded hover:bg-red-950/60 text-zinc-500 hover:text-red-400 transition">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-400 bg-red-950/50 px-3 py-2 rounded-md">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium rounded-md transition">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : isEdit ? "Update Attribute" : "Create Attribute"}
          </button>
          <button type="button" onClick={() => router.push("/admin/attributes")} className="px-4 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-md transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
