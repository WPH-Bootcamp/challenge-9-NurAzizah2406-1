import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import type { Restaurant } from "@/types/restaurant";
import { Card, CardContent } from "@/components/ui/card";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/resto/${restaurant.id}`} className="group block w-full">
      <Card className="overflow-hidden border border-slate-100 hover:border-red-100 hover:shadow-md transition-all duration-300 bg-white rounded-2xl p-3">
        <div className="flex items-center gap-4">
          {/* Logo / Image on Left */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100 flex items-center justify-center">
            <Image
              src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80"}
              alt={restaurant.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="80px"
            />
          </div>

          {/* Info on Right */}
          <div className="flex-grow min-w-0 space-y-1.5">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800 line-clamp-1 group-hover:text-[#C12116] transition-colors leading-tight">
              {restaurant.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-700">
                {restaurant.rating != null ? restaurant.rating.toFixed(1) : "N/A"}
              </span>
            </div>

            {/* Location & Distance */}
            <div className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-xs font-medium truncate">
                {restaurant.location} &bull; {restaurant.distance ? `${restaurant.distance.toFixed(1)} km` : "2.4 km"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
