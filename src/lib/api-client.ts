// Client-side API wrapper — replaces direct imports from .server.ts in client components

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ─── Auth ──────────────────────────────────────────────────────

export async function login({ data }: { data: { username: string; password: string } }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function verifyAuth({ data }: { data: { token: string } }) {
  return apiFetch("/api/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ─── Orders ────────────────────────────────────────────────────

export async function getOrders({ data }: { data: { token: string } }) {
  return apiFetch(`/api/admin/orders?token=${encodeURIComponent(data.token)}`);
}

export async function createOrder({ data }: { data: any }) {
  return apiFetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getOrderById({ data }: { data: { token: string; id: number } }) {
  return apiFetch(`/api/admin/orders/${data.id}?token=${encodeURIComponent(data.token)}`);
}

export async function updateOrderStatus({ data }: { data: { token: string; id: number; status: string } }) {
  return apiFetch(`/api/admin/orders/${data.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: data.token, status: data.status }),
  });
}

// ─── Products ──────────────────────────────────────────────────

export async function getProducts() {
  return apiFetch("/api/products");
}

export async function getProductById({ data }: { data: { id: string } }) {
  return apiFetch(`/api/products/${encodeURIComponent(data.id)}`);
}

export async function getProductsByCategory({ data }: { data: { categorySlug: string } }) {
  return apiFetch(`/api/products?category=${encodeURIComponent(data.categorySlug)}`);
}

export async function getProductByDbId({ data }: { data: { id: number } }) {
  return apiFetch(`/api/admin/products/${data.id}`);
}

export async function getCategories() {
  return apiFetch("/api/categories");
}

export async function getCategoriesWithSubcategories() {
  return apiFetch("/api/categories?withSubcategories=true");
}

export async function createProduct({ data }: { data: any }) {
  return apiFetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateProduct({ data }: { data: any }) {
  return apiFetch(`/api/admin/products/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteProduct({ data }: { data: { token: string; id: number } }) {
  return apiFetch(`/api/admin/products/${data.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: data.token }),
  });
}

// ─── Subcategories ─────────────────────────────────────────────

export async function getSubcategories() {
  return apiFetch("/api/subcategories");
}

export async function getSubcategoriesByCategory({ data }: { data: { categoryId: number } }) {
  return apiFetch(`/api/subcategories?categoryId=${data.categoryId}`);
}

export async function createSubcategory({ data }: { data: any }) {
  return apiFetch("/api/admin/subcategories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateSubcategory({ data }: { data: any }) {
  return apiFetch(`/api/admin/subcategories/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteSubcategory({ data }: { data: { token: string; id: number } }) {
  return apiFetch(`/api/admin/subcategories/${data.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: data.token }),
  });
}

// ─── Categories ────────────────────────────────────────────────

export async function createCategory({ data }: { data: any }) {
  return apiFetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateCategory({ data }: { data: any }) {
  return apiFetch(`/api/admin/categories/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteCategory({ data }: { data: { token: string; id: number } }) {
  return apiFetch(`/api/admin/categories/${data.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: data.token }),
  });
}

// ─── Brands ────────────────────────────────────────────────────

export async function getBrands() {
  return apiFetch("/api/brands");
}

export async function getBrandBySlug({ data }: { data: { slug: string } }) {
  return apiFetch(`/api/brands/${encodeURIComponent(data.slug)}`);
}

export async function getProductsByBrand({ data }: { data: { brandSlug: string } }) {
  return apiFetch(`/api/products?brand=${encodeURIComponent(data.brandSlug)}`);
}

export async function getCountries() {
  return apiFetch("/api/brands/countries");
}

export async function getProductsFiltered({ data }: { data: Record<string, string | undefined> }) {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  return apiFetch(`/api/products/filtered?${params}`);
}

export async function createBrand({ data }: { data: any }) {
  return apiFetch("/api/admin/brands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateBrand({ data }: { data: any }) {
  return apiFetch(`/api/admin/brands/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteBrand({ data }: { data: { token: string; id: number } }) {
  return apiFetch(`/api/admin/brands/${data.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: data.token }),
  });
}

export async function setBrandFeaturedProducts({ data }: { data: { token: string; brandId: number; productIds: number[] } }) {
  return apiFetch(`/api/admin/brands/${data.brandId}/featured`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getBrandFeaturedProducts({ data }: { data: { brandId: number } }) {
  return apiFetch(`/api/admin/brands/${data.brandId}/featured`);
}

// ─── Reviews ───────────────────────────────────────────────────

export async function getProductReviews({ data }: { data: { productId: number } }) {
  return apiFetch(`/api/products/${data.productId}/reviews`);
}

export async function createReview({ data }: { data: any }) {
  return apiFetch("/api/products/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getAllReviews({ data }: { data: { token: string } }) {
  return apiFetch(`/api/admin/reviews?token=${encodeURIComponent(data.token)}`);
}

export async function updateReview({ data }: { data: any }) {
  return apiFetch(`/api/admin/reviews/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteReview({ data }: { data: { token: string; id: number } }) {
  return apiFetch(`/api/admin/reviews/${data.id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: data.token }),
  });
}

export async function getFiveStarReviews() {
  return apiFetch("/api/reviews/five-star");
}

// ─── Home Assignments ──────────────────────────────────────────

export async function getHomePageProducts({ data }: { data: { tabSlug: string } }) {
  return apiFetch(`/api/home-products?tabSlug=${encodeURIComponent(data.tabSlug)}`);
}

export async function getHomeAssignments() {
  return apiFetch("/api/admin/home-assignments");
}

export async function setHomeAssignment({ data }: { data: any }) {
  return apiFetch("/api/admin/home-assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set", ...data }),
  });
}

export async function removeHomeAssignment({ data }: { data: any }) {
  return apiFetch("/api/admin/home-assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "remove", ...data }),
  });
}

export async function reorderHomeAssignments({ data }: { data: any }) {
  return apiFetch("/api/admin/home-assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reorder", ...data }),
  });
}

// ─── Upload ────────────────────────────────────────────────────

export async function uploadProductImage({ data }: { data: { token: string; base64: string; fileName: string; folder?: string } }) {
  return apiFetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, type: "product" }),
  });
}

export async function uploadBrandImage({ data }: { data: { token: string; base64: string; fileName: string; folder?: string } }) {
  return apiFetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, type: "brand" }),
  });
}

export async function deleteProductImage({ data }: { data: { token: string; fileId: string } }) {
  return apiFetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
