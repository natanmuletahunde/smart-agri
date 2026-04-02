import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-primary mb-2 text-sm font-medium tracking-wide uppercase">
          Ethiopia
        </p>
        <h1 className="text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Smart Agricultural Marketplace
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Farmers list crops. Buyers order directly. Transporters move goods.
          Fewer middlemen, clearer prices, faster trade.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/marketplace"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Browse marketplace
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Create an account
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Farmers</CardTitle>
            <CardDescription>
              List teff, maize, coffee, and more with inventory and fair
              pricing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "inline-flex w-full justify-center"
              )}
            >
              Sell as farmer
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Buyers</CardTitle>
            <CardDescription>
              Discover suppliers, compare listings, and place orders in one
              place.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "inline-flex w-full justify-center"
              )}
            >
              Buy as buyer
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transporters</CardTitle>
            <CardDescription>
              Delivery workflows are ready to grow as you connect drivers to
              orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "inline-flex w-full justify-center"
              )}
            >
              Join as transporter
            </Link>
          </CardContent>
        </Card>
      </div>

      <footer className="border-t mt-16 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h4 className="font-semibold mb-2">Smart Agri</h4>
              <p className="text-muted-foreground text-sm">
                Digital Agricultural Marketplace for Ethiopia. Connecting farmers, buyers, and transporters.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link></li>
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/register" className="hover:text-foreground transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Created by</h4>
              <p className="text-muted-foreground text-sm">
                Smart Agri Team — Empowering Ethiopian agriculture through technology.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Smart Agri. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
