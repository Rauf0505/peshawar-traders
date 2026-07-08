"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  createBrand,
  updateBrand,
  getBrands,
  setBrandFeaturedProducts,
  getBrandFeaturedProducts,
  getProducts,
  uploadBrandImage,
} from "@/lib/api-client";
import { COUNTRIES, COUNTRY_CODE, getFlagEmoji } from "@/lib/countries";
import { Check, X, Upload, Loader2, Search } from "lucide-react";
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
  country: string;
  slug: string;
  description: string;
  logo: string;
  bannerImage: string;
}

const emptyForm: FormData = {
  name: "", country: "Turkey", slug: "", description: "", logo: "", bannerImage: "",
};

interface Props {
  editId?: number;
}

export function BrandFormPage({ editId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [productSearch, setProductSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!editId;

  const clearFieldError = (field: string) => setFieldErrors((prev) => ({ ...prev, [field]: "" }));

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Brand name is required";
    if (!form.country.trim()) errors.country = "Country is required";
    if (!form.slug.trim()) errors.slug = "Slug is required";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) setError("Please fix the highlighted fields.");
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  useEffect(() => {
    if (isEdit && editId) {
      Promise.all([
        getBrands(),
        getBrandFeaturedProducts({ data: { brandId: editId } }),
      ]).then(([brands, featuredIds]) => {
        const brand = brands.find((b) => b.id === editId);
        if (brand) {
          setForm({
            name: brand.name,
            country: brand.country,
            slug: brand.slug,
            description: brand.description || "",
            logo: brand.logo || "",
            bannerImage: brand.bannerImage || "",
          });
          setSlugManuallyEdited(true);
        }
        setSelectedProductIds(featuredIds);
        setLoading(false);
      });
    }
  }, [editId]);

  const update = (field: keyof FormData, value: string) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "name" && !slugManuallyEdited) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const toggleProduct = (id: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length >= 6
        ? prev
        : [...prev, id],
    );
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase()),
  );

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await uploadBrandImage({
        data: { token: getToken(), base64, fileName: file.name, folder: "brands/logos" },
      });
      update("logo", result.url);
      toast.success("Logo uploaded");
    } catch (err: any) {
      toast.error(err.message || "Logo upload failed");
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await uploadBrandImage({
        data: { token: getToken(), base64, fileName: file.name, folder: "brands/banners" },
      });
      update("bannerImage", result.url);
      toast.success("Banner uploaded");
    } catch (err: any) {
      toast.error(err.message || "Banner upload failed");
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      let brandId = editId!;
      if (isEdit) {
        await updateBrand({ data: { token: getToken(), id: editId!, ...form, bannerImage: form.bannerImage } });
      } else {
        const res = await createBrand({ data: { token: getToken(), ...form, bannerImage: form.bannerImage } });
        brandId = Number(res.id);
      }
      await setBrandFeaturedProducts({
        data: { token: getToken(), brandId, productIds: selectedProductIds },
      });
      toast.success(isEdit ? "Brand updated successfully" : "Brand created successfully");
      router.push("/admin/brands");
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
        {isEdit ? "Edit Brand" : "New Brand"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Brand Name *</label>
            <input
              value={form.name}
              onChange={(e) => { clearFieldError("name"); update("name", e.target.value); }}
              className={inputCls("name")}
              placeholder="e.g. Hatsan"
              required
            />
            {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className={labelCls}>Country *</label>
            <div className="relative">
              <div className="relative mb-1.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search countries…"
                  className="w-full h-9 pl-9 pr-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div className="border border-zinc-800 rounded-md max-h-48 overflow-y-auto">
                {filteredCountries.length === 0 ? (
                  <p className="text-zinc-600 text-sm px-4 py-3">No countries found.</p>
                ) : (
                  filteredCountries.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { clearFieldError("country"); update("country", c); setCountrySearch(""); }}
                      className={`w-full text-left px-4 py-2 text-sm transition border-b border-zinc-800/50 last:border-0 ${
                        form.country === c
                          ? "bg-emerald-600/20 text-emerald-300"
                          : "text-zinc-100 hover:bg-zinc-800/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {form.country === c && <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                        <span className={form.country === c ? "ml-0" : "ml-5.5"}>
                          {COUNTRY_CODE[c] && <span className="mr-1.5">{getFlagEmoji(COUNTRY_CODE[c])}</span>}
                          {c}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
            {fieldErrors.country && <p className="text-xs text-red-400 mt-1">{fieldErrors.country}</p>}
          </div>
        </div>

        <div>
            <label className={labelCls}>Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => { clearFieldError("slug"); setSlugManuallyEdited(true); update("slug", e.target.value); }}
              className={inputCls("slug")}
              placeholder="e.g. hatsan-turkey"
              required
            />
            {fieldErrors.slug && <p className="text-xs text-red-400 mt-1">{fieldErrors.slug}</p>}
            <p className="text-xs text-zinc-600 mt-1">Used in URLs: /brands/{form.slug || "…"}</p>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
            placeholder="Brief brand description…"
          />
        </div>

        {/* Logo & Banner */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Logo</label>
            {form.logo && (
              <div className="relative mb-2">
                <img src={form.logo} alt="logo preview" className="h-20 object-contain rounded bg-zinc-800 w-full" />
                <button
                  type="button"
                  onClick={() => update("logo", "")}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600/90 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <label className={`inline-flex items-center gap-2 px-4 h-9 ${form.logo ? "bg-zinc-800/50 hover:bg-zinc-700/50" : "bg-zinc-800 hover:bg-zinc-700"} text-sm rounded-md cursor-pointer transition text-zinc-100`}>
              {uploadingLogo ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><Upload className="h-4 w-4" /> {form.logo ? "Replace" : "Upload Logo"}</>}
              <input ref={logoInputRef} type="file" accept="image/*" hidden onChange={handleLogoUpload} disabled={uploadingLogo} />
            </label>
          </div>
          <div>
            <label className={labelCls}>Banner Image</label>
            {form.bannerImage && (
              <div className="relative mb-2">
                <img src={form.bannerImage} alt="banner preview" className="h-20 w-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => update("bannerImage", "")}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600/90 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <label className={`inline-flex items-center gap-2 px-4 h-9 ${form.bannerImage ? "bg-zinc-800/50 hover:bg-zinc-700/50" : "bg-zinc-800 hover:bg-zinc-700"} text-sm rounded-md cursor-pointer transition text-zinc-100`}>
              {uploadingBanner ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</> : <><Upload className="h-4 w-4" /> {form.bannerImage ? "Replace" : "Upload Banner"}</>}
              <input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={handleBannerUpload} disabled={uploadingBanner} />
            </label>
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <label className={labelCls}>
            Featured Products <span className="text-zinc-600 normal-case tracking-normal">(max 6, {selectedProductIds.length} selected)</span>
          </label>
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 px-3 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition mb-2"
          />
          <div className="border border-zinc-800 rounded-md max-h-64 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <p className="text-zinc-600 text-sm px-4 py-3">No products found.</p>
            ) : (
              filteredProducts.map((p) => {
                const selected = selectedProductIds.includes(p.id);
                const disabled = !selected && selectedProductIds.length >= 6;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    disabled={disabled}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-zinc-800/60 transition border-b border-zinc-800/50 last:border-0 ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    <div className={`h-5 w-5 rounded border flex items-center justify-center shrink-0 transition ${selected ? "bg-emerald-600 border-emerald-600" : "border-zinc-700"}`}>
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-zinc-100 truncate">{p.name}</div>
                      <div className="text-zinc-500 text-xs">{p.sku} · Rs.{p.price}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
          {selectedProductIds.length > 0 && (
            <p className="text-xs text-emerald-400 mt-1.5">
              {selectedProductIds.length} product{selectedProductIds.length > 1 ? "s" : ""} selected as featured
            </p>
          )}
        </div>

        {error && <p className="text-sm text-red-400 bg-red-950/50 px-3 py-2 rounded-md">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium rounded-md transition text-white"
          >
            {saving ? "Saving…" : isEdit ? "Update Brand" : "Create Brand"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/brands")}
            className="px-5 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition text-zinc-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
