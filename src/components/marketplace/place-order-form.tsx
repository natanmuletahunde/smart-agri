"use client";

import { useActionState } from "react";
import { placeOrder, type PlaceOrderState } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

const initialState: PlaceOrderState = {};

export function PlaceOrderForm({
  productId,
  maxQuantity,
  unitPrice,
}: {
  productId: string;
  maxQuantity: number;
  unitPrice: number;
}) {
  const [state, formAction, pending] = useActionState(placeOrder, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="product_id" value={productId} />
      {state?.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={Math.max(1, maxQuantity)}
          step={1}
          defaultValue={1}
          required
        />
        <p className="text-muted-foreground text-xs">
          Unit price: {unitPrice.toFixed(2)} ETB · Max: {maxQuantity}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="delivery_address">Delivery address</Label>
        <Textarea
          id="delivery_address"
          name="delivery_address"
          placeholder="Kebele, woreda, region…"
          required
          rows={3}
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Placing order…" : "Place order"}
      </Button>
      <p className="text-muted-foreground text-center text-xs">
        You must be registered as a{" "}
        <Link href="/register" className="text-primary underline">
          buyer
        </Link>{" "}
        to order.
      </p>
    </form>
  );
}
