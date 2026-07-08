import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useCart } from "@/lib/cart-context";

export function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <div className="bg-background text-foreground">
      <Header />
      <main className="pt-20">
        <section className="py-16 md:py-24">
          <div className="container-x">
            <div className="mb-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>

            <div className="max-w-5xl">
              <span className="eyebrow">Shopping Cart</span>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.05]">
                Your Cart
              </h1>
              <p className="mt-2 text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-24">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-xl font-medium text-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add some products to get started.</p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-charcoal transition"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="mt-10 grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.sku}
                      className="flex gap-4 bg-secondary/30 rounded-lg p-4 border border-border/40"
                    >
                      <Link
                        href={`/product/${item.sku}`}
                        className="size-24 shrink-0 rounded-md overflow-hidden bg-background"
                      >
                        {item.images[0] && (
                          <Image src={item.images[0]} alt={item.name} width={96} height={96} className="h-full w-full object-cover" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/product/${item.sku}`}
                            className="font-medium text-foreground hover:text-primary transition line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-0.5">SKU: {item.sku}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-border rounded">
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                              className="grid place-items-center h-8 w-8 hover:bg-muted transition"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                              className="grid place-items-center h-8 w-8 hover:bg-muted transition"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-foreground">Rs.{item.price * item.quantity}</span>
                            <button
                              onClick={() => removeItem(item.sku)}
                              className="text-muted-foreground hover:text-destructive transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={clearCart}
                      className="text-sm text-muted-foreground hover:text-destructive transition"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-secondary/30 rounded-lg p-6 border border-border/40 sticky top-28">
                    <h3 className="font-semibold text-lg text-foreground mb-4">Order Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium text-foreground">Rs.{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-muted-foreground">Calculated at checkout</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between text-base">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-foreground">Rs.{subtotal}</span>
                      </div>
                    </div>
                    <Link
                      href="/checkout"
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-6 text-sm uppercase tracking-wider font-semibold rounded-md hover:bg-charcoal transition"
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
