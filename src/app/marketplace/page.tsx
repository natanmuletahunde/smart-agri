import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const marketplaceData = [
  {
    category: "Farmers",
    items: [
      {
        title: "Local Farmers",
        description: "Fresh organic produce directly from local farmers.",
        imageUrl: "https://images.stockcake.com/public/e/6/e/e6e4865c-08b7-4633-b428-f5658462485e_large/farmers-tending-crops-stockcake.jpg",
      },
      {
        title: "Crop Production",
        description: "Quality crops grown with traditional Ethiopian methods.",
        imageUrl: "https://img.freepik.com/premium-vector/indian-farmer-wheat-field_1301788-796.jpg",
      },
      {
        title: "Agricultural Activities",
        description: "Sustainable farming practices across Ethiopia.",
        imageUrl: "https://assets.weforum.org/article/image/large_2Gjn6a8oBEvxT7-r6ERM1Hm4A-QDXod0HZ_SJgcFk30.jpg",
      },
      {
        title: "Farm Workers",
        description: "Dedicated farmers working in crop fields daily.",
        imageUrl: "https://img.freepik.com/free-vector/street-seller-illustration_1284-11371.jpg",
      },
    ],
  },
  {
    category: "Sellers",
    items: [
      {
        title: "Market Vendors",
        description: "Trusted sellers providing quality goods in local markets.",
        imageUrl: "https://media.gettyimages.com/id/1460371339/photo/salesman-helping-the-his-customer-putting-the-bananas-in-a-plastic-bag-on-a-street-market.jpg",
      },
      {
        title: "Fruit Sellers",
        description: "Fresh fruits and vegetables from local vendors.",
        imageUrl: "https://static.vecteezy.com/system/resources/thumbnails/011/728/524/small/woman-seller-of-fruit-at-the-market-near-the-counter-photo.jpg",
      },
      {
        title: "Supermarket Sellers",
        description: "Professional sellers serving community needs.",
        imageUrl: "https://media.istockphoto.com/id/1461540763/photo/a-successful-seller-is-standing-at-supermarket-with-arms-crossed-and-smiling-at-the-camera.jpg",
      },
      {
        title: "Spice Sellers",
        description: "Traditional spices and herbs from Ethiopian markets.",
        imageUrl: "https://images.pexels.com/photos/21875151/pexels-photo-21875151/free-photo-of-spice-seller-portrait.jpeg",
      },
    ],
  },
  {
    category: "Transport & Equipment",
    items: [
      {
        title: "Agricultural Machinery",
        description: "Modern equipment supporting efficient farming.",
        imageUrl: "https://www.shutterstock.com/image-photo/above-view-on-agricultural-machine-600nw-2497384375.jpg",
      },
      {
        title: "Transport Logistics",
        description: "Efficient transport and logistics for agricultural goods.",
        imageUrl: "https://mega.onelogix.com/wp-content/uploads/2024/10/agriculture-equipment-logistics-heavy-machinery-transport-1024x576.png",
      },
      {
        title: "Farm Equipment",
        description: "Quality equipment for modern agriculture.",
        imageUrl: "https://www.shutterstock.com/image-photo/aerila-angle-view-youthful-handsome-260nw-2620179719.jpg",
      },
      {
        title: "Heavy Machinery",
        description: "Advanced machinery for large-scale farming.",
        imageUrl: "https://abedinequipment.com/wp-content/uploads/2021/06/47T.png",
      },
    ],
  },
];

interface CategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
}

function CategoryCard({ title, description, imageUrl }: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <p className="text-white/80 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: string;
  items: CategoryCardProps[];
}

function CategorySection({ category, items }: CategorySectionProps) {
  const emoji = category === "Farmers" ? "🌾" : category === "Sellers" ? "🧑‍🌾" : "🚚";
  
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-xl font-bold tracking-tight">{category}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <CategoryCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse listings from farmers, sellers, and transporters across Ethiopia.
        </p>
      </div>

      <div className="space-y-10">
        {marketplaceData.map((section) => (
          <CategorySection
            key={section.category}
            category={section.category}
            items={section.items}
          />
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-muted p-6 text-center">
        <h3 className="text-lg font-semibold">Join Our Marketplace</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Are you a farmer, seller, or transporter? Create an account to list your products and services.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            )}
          >
            Register Now
          </Link>
          <Link
            href="/about"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            )}
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}