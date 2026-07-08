import { useState } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/lib/api/orders.server";
import { ArrowLeft, ShoppingBag, CheckCircle, CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ orderNumber: string; total: number } | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod" as "cod" | "bank_transfer",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.customerName.trim()) errs.customerName = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await createOrder({
        data: {
          customerName: form.customerName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          paymentMethod: form.paymentMethod,
          notes: form.notes || undefined,
          items: items.map((i) => ({
            sku: i.sku,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        },
      });
      clearCart();
      setConfirmation({ orderNumber: result.orderNumber, total: result.total });
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (confirmation) {
    return (
      <div className="bg-background text-foreground">
        <Header />
        <main className="pt-20">
          <section className="py-24">
            <div className="container-x max-w-lg text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-6" />
              <h1 className="font-display text-3xl md:text-4xl font-medium leading-[1.05]">
                Order Confirmed!
              </h1>
              <p className="mt-3 text-muted-foreground">
                Thank you for your order. Your order number is:
              </p>
              <p className="mt-2 text-2xl font-bold text-foreground font-mono">
                {confirmation.orderNumber}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Total: <span className="font-semibold text-foreground">Rs.{confirmation.total}</span>
              </p>
              <div className="mt-8 space-y-3">
                <p className="text-sm text-muted-foreground">
                  We'll process your order and get back to you shortly. You can track your order status by contacting us with your order number.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-charcoal transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-background text-foreground">
        <Header />
        <main className="pt-20">
          <section className="py-24">
            <div className="container-x text-center">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-xl font-medium text-foreground">Your cart is empty</p>
              <Link
                to="/products"
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-wider font-semibold hover:bg-charcoal transition"
              >
                Browse Products
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-x">
            <div className="mb-6">
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Link>
            </div>

            <span className="eyebrow">Checkout</span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.05]">
              Place your order
            </h1>

            <div className="mt-10 grid lg:grid-cols-5 gap-10">
              <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
                <div className="bg-secondary/20 rounded-lg p-6 border border-border/40">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                      <input
                        type="text"
                        value={form.customerName}
                        onChange={(e) => update("customerName", e.target.value)}
                        className="w-full h-11 px-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
                      />
                      {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className="w-full h-11 px-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className="w-full h-11 px-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 rounded-lg p-6 border border-border/40">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Shipping Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Address</label>
                      <textarea
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition resize-none"
                      />
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>
                    <div className="sm:w-1/2">
                      <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="w-full h-11 px-4 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition"
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/20 rounded-lg p-6 border border-border/40">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-md border border-border/60 cursor-pointer hover:bg-secondary/40 transition has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={form.paymentMethod === "cod"}
                        onChange={() => update("paymentMethod", "cod")}
                        className="accent-primary"
                      />
                      <Banknote className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-sm text-foreground">Cash on Delivery</span>
                        <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-md border border-border/60 cursor-pointer hover:bg-secondary/40 transition has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank_transfer"
                        checked={form.paymentMethod === "bank_transfer"}
                        onChange={() => update("paymentMethod", "bank_transfer")}
                        className="accent-primary"
                      />
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-sm text-foreground">Bank Transfer</span>
                        <p className="text-xs text-muted-foreground">Pay via direct bank deposit</p>
                      </div>
                    </label>
                  </div>
                  {form.paymentMethod === "bank_transfer" && (
                    <div className="mt-3 p-3 rounded-md bg-secondary/40 text-sm text-muted-foreground">
                      After placing your order, we'll share our bank details for the transfer. Your order will be processed once payment is confirmed.
                    </div>
                  )}
                </div>

                <div className="bg-secondary/20 rounded-lg p-6 border border-border/40">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Order Notes (optional)</h3>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    placeholder="Any special instructions or requests..."
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary transition resize-none"
                  />
                </div>
              </form>

              <div className="lg:col-span-2">
                <div className="bg-secondary/20 rounded-lg p-6 border border-border/40 sticky top-28">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Order Summary</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                    {items.map((item) => (
                      <div key={item.sku} className="flex gap-3">
                        <div className="size-14 shrink-0 rounded overflow-hidden bg-background">
                          {item.images[0] && (
                            <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          <p className="text-sm font-semibold text-foreground">Rs.{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">Rs.{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-muted-foreground">To be confirmed</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between text-base">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-foreground">Rs.{subtotal}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-6 text-sm uppercase tracking-wider font-semibold rounded-md hover:bg-charcoal transition disabled:opacity-50"
                  >
                    {submitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
