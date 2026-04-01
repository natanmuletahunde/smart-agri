"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PlaceOrderState = { error?: string | null };

export async function placeOrder(
  _prevState: PlaceOrderState | undefined,
  formData: FormData
): Promise<PlaceOrderState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to place an order." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "buyer") {
    return {
      error: "Only buyers can place orders. Register as a buyer or update your profile.",
    };
  }

  const productId = String(formData.get("product_id") ?? "");
  const quantity = Number(formData.get("quantity"));
  const deliveryAddress = String(formData.get("delivery_address") ?? "").trim();

  if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
    return { error: "Invalid product or quantity." };
  }

  if (!deliveryAddress) {
    return { error: "Delivery address is required." };
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price, quantity, farmer_id")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return { error: "Product not found." };
  }

  if (product.farmer_id === user.id) {
    return { error: "You cannot order your own product." };
  }

  const qty = Number(product.quantity);
  if (!Number.isFinite(qty) || qty < quantity) {
    return { error: "Not enough stock for this quantity." };
  }

  const unitPrice = Number(product.price);
  const totalPrice = unitPrice * quantity;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: user.id,
      total_price: totalPrice,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: orderError?.message ?? "Could not create order." };
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: productId,
    quantity,
    price: unitPrice,
  });

  if (itemError) {
    return { error: itemError.message };
  }

  const { error: stockError } = await supabase
    .from("products")
    .update({ quantity: qty - quantity })
    .eq("id", productId);

  if (stockError) {
    return { error: stockError.message };
  }

  const { error: deliveryError } = await supabase.from("deliveries").insert({
    order_id: order.id,
    transporter_id: null,
    status: "assigned",
    delivery_address: deliveryAddress,
  });

  if (deliveryError) {
    return { error: deliveryError.message };
  }

  revalidatePath("/marketplace");
  revalidatePath("/orders");
  revalidatePath("/farmer/orders");
  redirect("/orders");
}

