import { Link } from "@tanstack/react-router";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { items, itemCount, subtotal, cartOpen, closeCart, updateQuantity, removeItem } = useCart();

  return (
    <Sheet open={cartOpen} onOpenChange={(open) => { if (!open) closeCart(); }}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="font-medium text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add some products to get started.</p>
            <Link
              to="/products"
              onClick={closeCart}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-charcoal transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.sku} className="flex gap-3 bg-secondary/40 rounded-md p-3">
                  <div className="size-20 shrink-0 rounded-md overflow-hidden bg-background">
                    {item.images[0] && (
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/product/$id"
                      params={{ id: item.sku }}
                      onClick={closeCart}
                      className="text-sm font-medium text-foreground hover:text-primary transition line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm font-semibold text-foreground mt-1">Rs.{item.price}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded">
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="grid place-items-center h-7 w-7 hover:bg-muted transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="grid place-items-center h-7 w-7 hover:bg-muted transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.sku)}
                        className="text-muted-foreground hover:text-destructive transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-foreground">Rs.{subtotal}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout.</p>
              <div className="flex gap-2">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="flex-1 inline-flex items-center justify-center rounded-md border border-border text-foreground py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-secondary transition"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex-1 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-charcoal transition"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
