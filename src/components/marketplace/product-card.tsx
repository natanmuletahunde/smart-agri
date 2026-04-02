import Link from "next/link";
import type { Product } from "@/types/database";
import { ImageIcon, MapPin, UserRound } from "lucide-react";
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
    <Card className="group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-emerald-100 via-lime-100 to-amber-100 dark:from-emerald-950/40 dark:via-lime-950/40 dark:to-amber-950/40">
        <div className="text-foreground/70 absolute inset-0 flex items-center justify-center gap-2">
          <ImageIcon className="size-5" />
          <span className="text-sm font-medium">Product image</span>
        </div>
      </div>
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
        <div className="text-muted-foreground space-y-1 text-sm">
          {farmerName ? (
            <p className="flex items-center gap-1.5">
              <UserRound className="size-3.5" />
              <span className="font-medium text-foreground">{farmerName}</span>
            </p>
          ) : null}
          {(product.location || farmerLocation) ? (
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              <span>{product.location ?? farmerLocation}</span>
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
