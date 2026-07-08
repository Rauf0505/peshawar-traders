import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { eq, desc, getTableColumns } from "drizzle-orm";
import { getDb } from "../db/connection.server";
import { orders, orderItems } from "../db/schema.server";
import { verifyToken } from "./auth.server";

function requireAuth(token: string) {
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

const orderStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

const cartItemSchema = z.object({
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
});

export const createOrder = createServerFn({ method: "POST" })
  .validator(
    z.object({
      customerName: z.string().min(1, "Name is required"),
      email: z.string().email("Valid email is required"),
      phone: z.string().min(1, "Phone is required"),
      address: z.string().min(1, "Address is required"),
      city: z.string().min(1, "City is required"),
      paymentMethod: z.enum(["cod", "bank_transfer"]),
      notes: z.string().optional(),
      items: z.array(cartItemSchema).min(1, "Cart is empty"),
    }),
  )
  .handler(async ({ data }) => {
    const db = await getDb();
    const total = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const orderNumber = `WC-${Date.now()}`;

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        paymentMethod: data.paymentMethod,
        notes: data.notes ?? "",
        status: "pending",
        total,
      })
      .returning();

    await db.insert(orderItems).values(
      data.items.map((i) => ({
        orderId: order.id,
        productSku: i.sku,
        productName: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity,
      })),
    );

    return {
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
    };
  });

export const getOrders = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const db = await getDb();
    const rows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    return rows;
  });

export const getOrderById = createServerFn({ method: "POST" })
  .validator(z.object({ token: z.string(), id: z.number() }))
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const db = await getDb();
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, data.id))
      .limit(1);
    if (!order) throw new Error("Order not found");

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, data.id))
      .orderBy(orderItems.id);

    return { ...order, items };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .validator(
    z.object({
      token: z.string(),
      id: z.number(),
      status: z.enum(orderStatuses),
    }),
  )
  .handler(async ({ data }) => {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(orders)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(orders.id, data.id));
    return { success: true };
  });
