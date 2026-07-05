import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getProducts, getCategories } from "@/lib/api/products.server";
import { getBrands } from "@/lib/api/brands.server";
import { Package, Tags, AlertTriangle, Tag, Clock } from "lucide-react";

export function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0, categories: 0, brands: 0, onDemand: 0, outOfStock: 0,
  });

  const loadStats = () => {
    Promise.all([getProducts(), getCategories(), getBrands()]).then(([products, cats, brands]) => {
      setStats({
        products: products.length,
        categories: cats.length,
        brands: brands.length,
        onDemand: products.filter((p: any) => p.stockStatus === "On Demand").length,
        outOfStock: products.filter((p: any) => p.stockStatus === "Out of Stock").length,
      });
    });
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-lg font-display font-medium mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { icon: Package, color: "text-emerald-400", value: stats.products, label: "Total Products" },
          { icon: Tags, color: "text-blue-400", value: stats.categories, label: "Categories" },
          { icon: Tag, color: "text-violet-400", value: stats.brands, label: "Brands" },
          { icon: Clock, color: "text-blue-400", value: stats.onDemand, label: "On Demand" },
          { icon: AlertTriangle, color: "text-red-400", value: stats.outOfStock, label: "Out of Stock" },
        ].map(({ icon: Icon, color, value, label }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-2xl font-bold text-zinc-100">{value}</span>
            </div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/admin/products/new" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded-md transition text-white">
          Add Product
        </Link>
        <Link to="/admin/products" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition text-zinc-100">
          Manage Products
        </Link>
        <Link to="/admin/brands/new" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition text-zinc-100">
          Add Brand
        </Link>
        <Link to="/admin/brands" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-md transition text-zinc-100">
          Manage Brands
        </Link>
      </div>
    </div>
  );
}
