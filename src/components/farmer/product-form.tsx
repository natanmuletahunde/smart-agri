"use client";

import { useActionState } from "react";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/app/actions/products";
import type { Product } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialCreate: ProductFormState = {};

export function CreateProductForm() {
  const [state, formAction, pending] = useActionState(
    createProduct,
    initialCreate
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <ProductFields />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Publish listing"}
      </Button>
    </form>
  );
}

export function EditProductForm({ product }: { product: Product }) {
  const boundUpdate = updateProduct.bind(null, product.id);
  const [state, formAction, pending] = useActionState(
    boundUpdate,
    initialCreate
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <ProductFields
        defaultValues={{
          name: product.name,
          category: product.category ?? "",
          description: product.description ?? "",
          price: String(product.price),
          quantity: String(product.quantity),
          location: product.location ?? "",
        }}
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

function ProductFields({
  defaultValues,
}: {
  defaultValues?: {
    name: string;
    category: string;
    description: string;
    price: string;
    quantity: string;
    location: string;
  };
}) {
  const d = defaultValues ?? {
    name: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    location: "",
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Product name</Label>
        <Input id="name" name="name" required defaultValue={d.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          placeholder="e.g. Teff, Coffee, Maize"
          defaultValue={d.category}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={d.description}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price (ETB per unit)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            required
            defaultValue={d.price}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity available</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min={0}
            step="1"
            required
            defaultValue={d.quantity}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Origin / location</Label>
        <Input
          id="location"
          name="location"
          placeholder="Town or region"
          defaultValue={d.location}
        />
      </div>
    </>
  );
}
