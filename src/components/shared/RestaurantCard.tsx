import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Tag } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/resto/${restaurant.id}`} className="group block">
      <Card className="overflow-hidden border-border/40 hover:border-orange-200 hover:shadow-md transition-all duration-300 h-full flex flex-col bg-white">
        {/* Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
          <Image
            src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60"}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 backdrop-blur-xs text-orange-600 border-none font-bold flex items-center gap-1 shadow-sm px-2 py-1">
              <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{restaurant.rating.toFixed(1)}</span>
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-grow flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Tag className="w-3 h-3 text-orange-500" />
              <span className="font-semibold text-orange-600 bg-orange-50/50 px-2 py-0.5 rounded-md">
                {restaurant.category}
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-800 line-clamp-1 group-hover:text-orange-500 transition-colors">
              {restaurant.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
              <span className="line-clamp-1">{restaurant.location}</span>
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Estimasi harga</span>
            <span className="text-xs font-bold text-slate-700">
              {formatPrice(restaurant.priceMin)} - {formatPrice(restaurant.priceMax)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
