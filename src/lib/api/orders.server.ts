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

export async function createOrder({ data }: { data: any }) {
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
  }

export async function getOrders({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    const rows = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    return rows;
  }

export async function getOrderById({ data }: { data: any }) {
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
  }

export async function updateOrderStatus({ data }: { data: any }) {
    requireAuth(data.token);
    const db = await getDb();
    await db
      .update(orders)
      .set({ status: data.status, updatedAt: new Date() })
      .where(eq(orders.id, data.id));
    return { success: true };
  }
