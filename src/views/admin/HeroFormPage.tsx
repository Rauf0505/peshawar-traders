"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getAdminHeroSlides, createHeroSlide, updateHeroSlide, uploadHeroImage } from "@/lib/api-client";
import { Upload, Loader2, Image, Video, Play, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

function getToken(): string {
  return typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
}

interface FormData {
  mediaType: string;
  mediaUrl: string;
  eyebrowText: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  duration: number;
  videoMuted: number;
  showScrollIndicator: number;
  isActive: number;
}

const emptyForm: FormData = {
  mediaType: "image",
  mediaUrl: "",
  eyebrowText: "",
  headingLine1: "",
  headingLine2: "",
  description: "",
  button1Text: "",
  button1Link: "",
  button2Text: "",
  button2Link: "",
  duration: 5,
  videoMuted: 1,
  showScrollIndicator: 1,
  isActive: 1,
};

interface Props {
  editId?: number;
}

export function HeroFormPage({ editId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewMuted, setPreviewMuted] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEdit = !!editId;

  const update = (field: keyof FormData, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  useEffect(() => {
    if (isEdit && editId) {
      getAdminHeroSlides().then((slides: any[]) => {
        const slide = slides.find((s: any) => s.id === editId);
        if (slide) {
          setForm({
            mediaType: slide.mediaType || "image",
            mediaUrl: slide.mediaUrl || "",
            eyebrowText: slide.eyebrowText || "",
            headingLine1: slide.headingLine1 || "",
            headingLine2: slide.headingLine2 || "",
            description: slide.description || "",
            button1Text: slide.button1Text || "",
            button1Link: slide.button1Link || "",
            button2Text: slide.button2Text || "",
            button2Link: slide.button2Link || "",
            duration: slide.duration ?? 5,
            videoMuted: slide.videoMuted ?? 1,
            showScrollIndicator: slide.showScrollIndicator ?? 1,
            isActive: slide.isActive ?? 1,
          });
        }
        setLoading(false);
      });
    }
  }, [editId]);

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await uploadHeroImage({
        data: {
          token: getToken(),
          base64,
          fileName: file.name,
          folder: "hero",
        },
      });
      update("mediaUrl", result.url);
      toast.success("Media uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mediaUrl.trim()) {
      setError("Please upload or provide a media URL");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = {
        token: getToken(),
        ...form,
      };
      if (isEdit && editId) {
        await updateHeroSlide({ data: { ...payload, id: editId } });
        toast.success("Slide updated successfully");
      } else {
        await createHeroSlide({ data: payload });
        toast.success("Slide created successfully");
      }
      router.push("/admin/hero");
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
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
  const sectionCls = "border border-zinc-800 rounded-lg p-5";

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-lg font-display font-medium text-zinc-100">
          {isEdit ? "Edit Slide" : "New Slide"}
        </h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {isEdit ? "Update the hero slide details" : "Add a new slide to the hero carousel"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-zinc-100 mb-4">Media</h3>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => update("mediaType", "image")}
              className={`flex items-center gap-2 px-4 h-10 rounded-md text-sm font-medium transition ${
                form.mediaType === "image"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <Image className="h-4 w-4" />
              Image
            </button>
            <button
              type="button"
              onClick={() => update("mediaType", "video")}
              className={`flex items-center gap-2 px-4 h-10 rounded-md text-sm font-medium transition ${
                form.mediaType === "video"
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <Video className="h-4 w-4" />
              Video
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className={labelCls}>Upload {form.mediaType === "video" ? "Video" : "Image"}</label>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={form.mediaType === "video" ? "video/*" : "image/*"}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-4 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-md transition disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading..." : "Choose File"}
                </button>
              </div>
            </div>

            <div>
              <label className={labelCls}>Or paste URL directly</label>
              <input
                type="text"
                value={form.mediaUrl}
                onChange={(e) => update("mediaUrl", e.target.value)}
                placeholder="https://ik.imagekit.io/..."
                className={inputCls}
              />
            </div>

            {form.mediaUrl && (
              <div className="mt-3">
                <label className={labelCls}>Preview</label>
                <div className="relative rounded-lg overflow-hidden bg-zinc-900 max-h-64">
                  {form.mediaType === "video" ? (
                    <div className="relative">
                      <video
                        src={form.mediaUrl}
                        muted={previewMuted}
                        controls
                        className="w-full max-h-64 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setPreviewMuted(!previewMuted)}
                        className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                      >
                        {previewMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    </div>
                  ) : (
                    <img src={form.mediaUrl} alt="Preview" className="w-full max-h-64 object-contain" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-zinc-100 mb-4">Text Overlay (all optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Eyebrow Text</label>
              <input
                type="text"
                value={form.eyebrowText}
                onChange={(e) => update("eyebrowText", e.target.value)}
                placeholder="Spring Collection · 2026"
                className={inputCls}
              />
            </div>
            <div />
            <div>
              <label className={labelCls}>Heading Line 1</label>
              <input
                type="text"
                value={form.headingLine1}
                onChange={(e) => update("headingLine1", e.target.value)}
                placeholder="Built for the wild."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Heading Line 2 (italic)</label>
              <input
                type="text"
                value={form.headingLine2}
                onChange={(e) => update("headingLine2", e.target.value)}
                placeholder="Trusted for life."
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Premium airguns, tactical gear, and field-tested outdoor equipment..."
              rows={3}
              className={`${inputCls} h-auto py-2.5 resize-none`}
            />
          </div>
        </div>

        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-zinc-100 mb-4">Buttons (all optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Button 1 Text</label>
              <input
                type="text"
                value={form.button1Text}
                onChange={(e) => update("button1Text", e.target.value)}
                placeholder="Shop Now"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Button 1 Link</label>
              <input
                type="text"
                value={form.button1Link}
                onChange={(e) => update("button1Link", e.target.value)}
                placeholder="#products"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Button 2 Text</label>
              <input
                type="text"
                value={form.button2Text}
                onChange={(e) => update("button2Text", e.target.value)}
                placeholder="Explore Categories"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Button 2 Link</label>
              <input
                type="text"
                value={form.button2Link}
                onChange={(e) => update("button2Link", e.target.value)}
                placeholder="#categories"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className={sectionCls}>
          <h3 className="text-sm font-medium text-zinc-100 mb-4">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Duration (seconds)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={2}
                  max={15}
                  value={form.duration}
                  onChange={(e) => update("duration", Number(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="text-sm text-zinc-100 w-8 text-right">{form.duration}s</span>
              </div>
            </div>

            {form.mediaType === "video" && (
              <div>
                <label className={labelCls}>Video Sound</label>
                <button
                  type="button"
                  onClick={() => update("videoMuted", form.videoMuted === 1 ? 0 : 1)}
                  className={`flex items-center gap-2 px-4 h-10 rounded-md text-sm font-medium transition ${
                    form.videoMuted === 1
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  {form.videoMuted === 1 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {form.videoMuted === 1 ? "Start Muted" : "Start Unmuted"}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.showScrollIndicator === 1}
                onChange={(e) => update("showScrollIndicator", e.target.checked ? 1 : 0)}
                className="accent-emerald-500"
              />
              <span className="text-sm text-zinc-300">Show scroll indicator</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive === 1}
                onChange={(e) => update("isActive", e.target.checked ? 1 : 0)}
                className="accent-emerald-500"
              />
              <span className="text-sm text-zinc-300">Active</span>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 px-3 py-2 rounded-md">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-sm font-medium rounded-md transition"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : isEdit ? "Update Slide" : "Create Slide"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/hero")}
            className="px-4 h-10 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-md transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
