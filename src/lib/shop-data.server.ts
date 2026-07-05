export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id?: number;
  description?: string;
  display_order?: number;
  status?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
  display_order?: number;
  status?: number;
  subcategories: Subcategory[];
}

export interface ProductAttr {
  id?: number;
  rating?: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  weight: string;
  material: string;
  dimensions: string;
  color: string;
  brand: string;
  stockStatus: "In Stock" | "Out of Stock" | "On Demand";
  stockQuantity: number;
  visibility: boolean;
  featured: boolean;
  features: string[];
  metaTitle: string;
  metaDescription: string;
  category: string;
  subcategory: string;
  images: string[];
}




