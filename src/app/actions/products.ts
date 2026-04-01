"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || null;
  const description = String(formData.get("description") ?? "").trim() || null;
  const price = Number(formData.get("price"));
  const quantity = Number(formData.get("quantity"));
  const location = String(formData.get("location") ?? "").trim() || null;

  if (!name) {
    return { error: "Name is required." as const };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Valid price is required." as const };
  }
  if (!Number.isFinite(quantity) || quantity < 0) {
    return { error: "Valid quantity is required." as const };
  }

  return {
    name,
    category,
    description,
    price,
    quantity,
    location,
  };
}

export type ProductFormState = { error?: string | null };

export async function createProduct(
  _prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "farmer") {
    return { error: "Only farmers can create listings." };
  }

  const parsed = parseProductForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { error } = await supabase.from("products").insert({
    farmer_id: user.id,
    name: parsed.name,
    category: parsed.category,
    description: parsed.description,
    price: parsed.price,
    quantity: parsed.quantity,
    location: parsed.location,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/marketplace");
  revalidatePath("/farmer/products");
  redirect("/farmer/products");
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: existing } = await supabase
    .from("products")
    .select("farmer_id")
    .eq("id", productId)
    .single();

  if (!existing || existing.farmer_id !== user.id) {
    return { error: "Product not found or access denied." };
  }

  const parsed = parseProductForm(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.name,
      category: parsed.category,
      description: parsed.description,
      price: parsed.price,
      quantity: parsed.quantity,
      location: parsed.location,
    })
    .eq("id", productId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/marketplace");
  revalidatePath("/farmer/products");
  revalidatePath(`/marketplace/${productId}`);
  redirect("/farmer/products");
}

export async function deleteProduct(productId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  const { data: existing } = await supabase
    .from("products")
    .select("farmer_id")
    .eq("id", productId)
    .single();

  if (!existing || existing.farmer_id !== user.id) {
    throw new Error("Product not found or access denied.");
  }

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/marketplace");
  revalidatePath("/farmer/products");
  redirect("/farmer/products");
}
