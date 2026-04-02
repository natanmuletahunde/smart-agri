import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          About Smart Agri
        </h1>
        <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
          Bridging farmers, buyers, and transporters for a thriving agricultural marketplace in Ethiopia.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌾</span>
          <h2 className="text-2xl font-semibold">Our Mission</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Smart Agri is a digital agricultural marketplace designed to empower Ethiopian farmers, 
          connect buyers with local producers, and streamline transport logistics. We aim to eliminate 
          middlemen, ensure fair pricing, and create transparency in the agricultural supply chain. 
          By leveraging technology, we help farmers reach more buyers, buyers find quality produce, 
          and transporters efficiently move goods across the country.
        </p>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🚜</span>
          <h2 className="text-2xl font-semibold">What We Offer</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">For Farmers</h3>
            <p className="text-muted-foreground text-sm">
              List your crops with fair pricing, manage inventory, and receive orders directly from verified buyers.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">For Buyers</h3>
            <p className="text-muted-foreground text-sm">
              Browse diverse listings, compare prices, and place orders for fresh produce from local farmers.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">For Transporters</h3>
            <p className="text-muted-foreground text-sm">
              Connect with farmers and buyers to transport goods efficiently using our logistics network.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold mb-2">Direct Trade</h3>
            <p className="text-muted-foreground text-sm">
              No middlemen means better prices for farmers and better deals for buyers.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🌍</span>
          <h2 className="text-2xl font-semibold">Impact in Ethiopia</h2>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Ethiopia&apos;s agricultural sector is the backbone of the economy, employing millions of smallholder farmers. 
            However, fragmented markets and limited access to information often leave farmers at a disadvantage. 
            Smart Agri addresses these challenges by providing a centralized platform where farmers can showcase their produce, 
            buyers can discover quality products, and transporters can optimize their routes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our platform supports the livelihoods of farming communities, promotes sustainable agricultural practices, 
            and contributes to food security across the nation. By connecting stakeholders across the agricultural value chain, 
            we are building a more inclusive and efficient marketplace for Ethiopia.
          </p>
        </div>
      </section>

      <section className="rounded-lg bg-muted p-8 text-center">
        <h3 className="text-xl font-semibold">Get Started Today</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          Join thousands of farmers, buyers, and transporters already using Smart Agri.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Create Account
          </Link>
          <Link
            href="/marketplace"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Browse Marketplace
          </Link>
        </div>
      </section>
    </div>
  );
}