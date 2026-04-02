import Link from "next/link";
import type { Product } from "@/types/database";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  farmerName?: string | null;
  farmerLocation?: string | null;
};

export function ProductCard({
  product,
  farmerName,
  farmerLocation,
}: ProductCardProps) {
  const price = Number(product.price);
  const qty = Number(product.quantity);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
          {product.category ? (
            <Badge variant="secondary" className="shrink-0">
              {product.category}
            </Badge>
          ) : null}
        </div>
        <CardDescription className="line-clamp-2">
          {product.description ?? "No description."}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-3">
        <div className="text-muted-foreground text-sm">
          {farmerName ? (
            <p>
              <span className="font-medium text-foreground">Seller:</span>{" "}
              {farmerName}
            </p>
          ) : null}
          {(product.location || farmerLocation) ? (
            <p>
              <span className="font-medium text-foreground">Location:</span>{" "}
              {product.location ?? farmerLocation}
            </p>
          ) : null}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-primary text-xl font-semibold">
              {Number.isFinite(price) ? `${price.toFixed(2)} ETB` : "—"}
            </p>
            <p className="text-muted-foreground text-xs">
              In stock: {Number.isFinite(qty) ? qty : "—"}
            </p>
          </div>
          <Link
            href={`/marketplace/${product.id}`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            View
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
