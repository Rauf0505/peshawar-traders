import { useEffect, useState, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  getProductByDbId,
  getCategories,
  getSubcategories,
  createProduct,
  updateProduct,
  getProducts,
} from "@/lib/api/products.server";
import { getBrands } from "@/lib/api/brands.server";
import { uploadProductImage } from "@/lib/api/upload.server";
import { Upload, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

const stockStatuses = ["In Stock", "Out of Stock", "On Demand"];

interface FormData {
  name: string;
  sku: string;
  description: string;
  price: number;
  comparePrice: string;
  weight: string;
  material: string;
  dimensions: string;
  color: string;
  brand: string;
  brandId: number;
  stockStatus: string;
  stockQuantity: number;
  visibility: boolean;
  featured: boolean;
  rating: number;
  categoryId: number;
  subcategoryId: number;
  metaTitle: string;
  metaDescription: string;
  features: string[];
  images: string[];
}

const emptyForm: FormData = {
  name: "",
  sku: "",
  description: "",
  price: 0,
  comparePrice: "",
  weight: "",
  material: "",
  dimensions: "",
  color: "",
  brand: "",
  brandId: 0,
  stockStatus: "In Stock",
  stockQuantity: 0,
  visibility: true,
  featured: false,
  rating: 0,
  categoryId: 0,
  subcategoryId: 0,
  metaTitle: "",
  metaDescription: "",
  features: [],
  images: [],
};

interface ProductFormPageProps {
  editId?: number;
}

export function ProductFormPage({ editId }: ProductFormPageProps) {
  const router = useRouter();

  const [form, setForm] = useState<FormData>(emptyForm);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = editId !== undefined && editId > 0;

  const clearFieldError = (field: string) => setFieldErrors((prev) => ({ ...prev, [field]: "" }));

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Product name is required";
    if (!form.sku.trim()) errors.sku = "SKU is required";
    if (form.price <= 0) errors.price = "Price must be greater than 0";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) setError("Please fix the highlighted fields.");
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    Promise.all([getCategories(), getSubcategories(), getBrands()]).then(([cats, subs, brs]) => {
      setCategories(cats);
      setSubcategories(subs);
      setBrands(brs);
    });
  }, []);

  useEffect(() => {
    if (isEdit && editId) {
      getProductByDbId({ data: { id: editId } }).then((p) => {
        if (!p) return;
        setForm({
          name: p.name || "",
          sku: p.sku || "",
          description: p.description || "",
          price: p.price || 0,
          comparePrice: p.comparePrice ? String(p.comparePrice) : "",
          weight: p.weight || "",
          material: p.material || "",
          dimensions: p.dimensions || "",
          color: p.color || "",
          brand: p.brand || "",
          brandId: p.brandId || 0,
          stockStatus: p.stockStatus || "In Stock",
          stockQuantity: p.stockQuantity || 0,
          visibility: p.visibility ?? true,
          featured: p.featured ?? false,
          rating: p.rating || 0,
          categoryId: p.categoryId || 0,
          subcategoryId: p.subcategoryId || 0,
          metaTitle: p.metaTitle || "",
          metaDescription: p.metaDescription || "",
          features: p.features || [],
          images: p.images || [],
        });
        setLoading(false);
      });
    }
  }, [editId]);

  const inputCls = (field: string) => `w-full h-10 px-3 bg-zinc-900 border ${fieldErrors[field] ? "border-red-500" : "border-zinc-800"} rounded-md text-sm text-zinc-100 focus:outline-none ${fieldErrors[field] ? "focus:border-red-400" : "focus:border-emerald-500"} transition`;

  const filteredSubs = subcategories.filter(
    (s: any) => s.category_id === form.categoryId,
  );

  const update = (field: keyof FormData, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addFeature = () => update("features", [...form.features, ""]);
  const updateFeature = (i: number, val: string) => {
    const f = [...form.features];
    f[i] = val;
    update("features", f);
  };
  const removeFeature = (i: number) =>
    update(
      "features",
      form.features.filter((_, idx) => idx !== i),
    );

  const removeImage = (i: number) =>
    update(
      "images",
      form.images.filter((_, idx) => idx !== i),
    );

  const moveImage = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= form.images.length) return;
    const arr = [...form.images];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    update("images", arr);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await uploadProductImage({
        data: {
          token: getToken(),
          base64,
          fileName: file.name,
          folder: `products/${form.sku || "new"}`,
        },
      });
      update("images", [...form.images, result.url]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        token: getToken(),
        name: form.name,
        sku: form.sku,
        description: form.description,
        price: form.price,
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        weight: form.weight,
        material: form.material,
        dimensions: form.dimensions,
        color: form.color,
        brand: form.brand,
        brandId: form.brandId || undefined,
        stockStatus: form.stockStatus,
        stockQuantity: form.stockQuantity,
        visibility: form.visibility,
        featured: form.featured,
        features: form.features.filter(Boolean),
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        categoryId: form.categoryId,
        subcategoryId: form.subcategoryId,
        images: form.images.filter(Boolean),
        rating: form.rating,
      };

      if (isEdit && editId) {
        await updateProduct({ data: { ...payload, id: editId } });
      } else {
        await createProduct({ data: payload });
      }
      toast.success(isEdit ? "Product updated successfully" : "Product created successfully");
      router.navigate({ to: "/admin/products" });
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-zinc-500 text-sm">Loading...</div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-lg font-display font-medium mb-6">
        {isEdit ? "Edit Product" : "New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Name *</label>
            <input value={form.name} onChange={(e) => { clearFieldError("name"); update("name", e.target.value); }} className={inputCls("name")} placeholder="Product name" required />
            {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">SKU *</label>
            <input value={form.sku} onChange={(e) => { clearFieldError("sku"); update("sku", e.target.value); }} className={inputCls("sku")} placeholder="e.g. WPN-001" required />
            {fieldErrors.sku && <p className="text-xs text-red-400 mt-1">{fieldErrors.sku}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Price *</label>
            <input type="number" min={0} step="0.01" value={form.price} onChange={(e) => { clearFieldError("price"); update("price", Number(e.target.value)); }} className={inputCls("price")} required />
            {fieldErrors.price && <p className="text-xs text-red-400 mt-1">{fieldErrors.price}</p>}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Original Price (Compare At)</label>
            <input type="number" min={0} step="0.01" value={form.comparePrice} onChange={(e) => update("comparePrice", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Rating</label>
            <input type="number" min={0} max={5} step="0.1" value={form.rating} onChange={(e) => update("rating", Number(e.target.value))} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Weight</label>
            <input value={form.weight} onChange={(e) => update("weight", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Material</label>
            <input value={form.material} onChange={(e) => update("material", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Dimensions</label>
            <input value={form.dimensions} onChange={(e) => update("dimensions", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Color</label>
            <input value={form.color} onChange={(e) => update("color", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Brand</label>
            <select value={form.brandId} onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedBrand = brands.find(b => b.id === selectedId);
              update("brandId", selectedId);
              update("brand", selectedBrand ? selectedBrand.name : "");
            }} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition">
              <option value={0}>Select brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name} ({b.country})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Stock Quantity</label>
            <input type="number" min={0} value={form.stockQuantity} onChange={(e) => update("stockQuantity", Number(e.target.value))} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Stock Status</label>
            <select value={form.stockStatus} onChange={(e) => update("stockStatus", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition">
              {stockStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Category</label>
            <select value={form.categoryId} onChange={(e) => { update("categoryId", Number(e.target.value)); update("subcategoryId", 0); }} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition">
              <option value={0}>Select category</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Subcategory</label>
            <select value={form.subcategoryId} onChange={(e) => update("subcategoryId", Number(e.target.value))} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition">
              <option value={0}>Select subcategory</option>
              {filteredSubs.map((s: any) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.visibility} onChange={(e) => update("visibility", e.target.checked)} className="accent-emerald-500" />
              Visible
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="accent-emerald-500" />
              Featured
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Features</label>
          {form.features.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={f} onChange={(e) => updateFeature(i, e.target.value)} className="flex-1 h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
              <button type="button" onClick={() => removeFeature(i)} className="px-3 text-red-400 hover:bg-zinc-800 rounded transition">×</button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="text-xs text-emerald-400 hover:text-emerald-300 transition">+ Add feature</button>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Images</label>
          <div className="flex flex-wrap gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative w-28 h-28 rounded-md overflow-hidden border border-zinc-800 group">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="absolute top-1 left-1 w-5 h-5 bg-zinc-900/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 rounded text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-0">
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="absolute bottom-1 left-1 w-5 h-5 bg-zinc-900/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 rounded text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-0">
                  <ChevronDown className="h-3 w-3" />
                </button>
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-zinc-900/80 text-[10px] text-zinc-400 rounded">{i + 1}</span>
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-600/90 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">×</button>
              </div>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 mt-3 px-4 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-md cursor-pointer transition">
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><Upload className="h-4 w-4" /> Upload Image</>}
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileSelect} disabled={uploading} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Meta Title</label>
            <input value={form.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-1.5">Meta Description</label>
            <input value={form.metaDescription} onChange={(e) => update("metaDescription", e.target.value)} className="w-full h-10 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition" />
          </div>
        </div>

        {error && <p className="text-sm text-red-400 bg-red-950/50 px-3 py-2 rounded-md">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="px-5 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium rounded-md transition">
            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => router.navigate({ to: "/admin/products" })} className="px-5 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
