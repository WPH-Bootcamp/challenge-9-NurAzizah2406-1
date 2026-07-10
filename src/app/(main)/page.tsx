"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRestaurants, useBestSellers, useRecommended, useNearby } from "@/lib/query/resto";
import { useAuthStore } from "@/store/auth";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Star, MapPin, X, Loader2, Compass, Heart, Map } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "All",
  "Noodle",
  "Rice",
  "Burger",
  "Pizza",
  "Sushi",
  "Dessert",
  "Drink",
  "Chicken",
  "Indonesian",
  "Japanese",
  "Western",
];

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Filter states sync'd with URL
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const rating = searchParams.get("rating") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const location = searchParams.get("location") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update search query when URL changes
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // Helper to update URL search params
  const updateQueryParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ q: searchInput });
  };

  const handleCategorySelect = (cat: string) => {
    updateQueryParams({ category: cat });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    router.push(pathname);
  };

  // Fetch Recommended (Auth only)
  const { data: recommendedData, isLoading: isLoadingRec } = useRecommended({ limit: 4 });
  // Fetch Best Sellers
  const { data: bestSellerData, isLoading: isLoadingBest } = useBestSellers({ limit: 4 });
  // Fetch Nearby (Auth only)
  const { data: nearbyData, isLoading: isLoadingNearby } = useNearby({ range: 10, limit: 4 });

  // Fetch All Restaurants (with filters)
  const allRestaurantsParams = {
    category: category !== "All" ? category : undefined,
    rating: rating ? parseFloat(rating) : undefined,
    priceMin: priceMin ? parseInt(priceMin) : undefined,
    priceMax: priceMax ? parseInt(priceMax) : undefined,
    location: location || undefined,
  };
  const { data: listData, isLoading: isLoadingList } = useRestaurants(allRestaurantsParams);

  // Filter list data further by search query locally if API doesn't support combined search+filter easily
  const restaurantsToShow = listData?.data.filter((resto) =>
    resto.name.toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 p-8 md:p-12 text-white overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-xl space-y-4">
          <Badge className="bg-white/20 text-white border-none font-semibold">
            Promo Spesial Hari Ini
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Makanan Lezat Siap Diantar ke Pintu Anda
          </h1>
          <p className="text-orange-50 text-sm md:text-base">
            Temukan restoran terbaik dengan rating tertinggi dan promo menarik di sekitar kamu.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md pt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Cari restoran..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-white text-slate-800 border-none h-11 rounded-xl shadow-xs"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateQueryParams({ q: null });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-5">
              Cari
            </Button>
          </form>
        </div>

        {/* Decorative Circles */}
        <div className="absolute right-[-10%] bottom-[-20%] w-[400px] h-[400px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-[50%] top-[-30%] w-[300px] h-[300px] rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Kategori Makanan</h2>
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                category === cat
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-white border border-border hover:bg-orange-50/50 hover:text-orange-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Auth Specific Sections */}
      {mounted && token && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-xl font-bold text-slate-800">Rekomendasi Untukmu</h2>
            </div>
            {isLoadingRec ? (
              <div className="flex h-40 items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
            ) : recommendedData?.data && recommendedData.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedData.data.slice(0, 2).map((resto) => (
                  <RestaurantCard key={resto.id} restaurant={resto} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-slate-50 p-6 rounded-2xl">Belum ada rekomendasi saat ini.</p>
            )}
          </div>

          {/* Nearby Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-slate-800">Terdekat di Sekitarmu</h2>
            </div>
            {isLoadingNearby ? (
              <div className="flex h-40 items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
            ) : nearbyData?.data && nearbyData.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {nearbyData.data.slice(0, 2).map((resto) => (
                  <RestaurantCard key={resto.id} restaurant={resto} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground bg-slate-50 p-6 rounded-2xl">Tidak ada restoran di sekitar jangkauanmu.</p>
            )}
          </div>
        </div>
      )}

      {/* Best Seller Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h2 className="text-xl font-bold text-slate-800">Terlaris (Best Seller)</h2>
        </div>
        {isLoadingBest ? (
          <div className="flex h-40 items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-orange-500" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellerData?.data.map((resto) => (
              <RestaurantCard key={resto.id} restaurant={resto} />
            ))}
          </div>
        )}
      </div>

      {/* All Restaurants List with Filters */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">Semua Restoran</h2>
            <p className="text-sm text-muted-foreground">Menampilkan semua pilihan restoran terverifikasi</p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
              {(rating || priceMin || priceMax || location) && (
                <Badge className="ml-1 bg-orange-500 text-white text-[10px] px-1.5 py-0.5">Aktif</Badge>
              )}
            </Button>
            {(query || rating || priceMin || priceMax || location || category !== "All") && (
              <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Filter Drawer/Bar */}
        {showFilters && (
          <div className="bg-white border border-border/80 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Rating Minimum</label>
              <Select value={rating} onValueChange={(val) => updateQueryParams({ rating: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Semua Rating</SelectItem>
                  <SelectItem value="4.5">⭐ 4.5 ke atas</SelectItem>
                  <SelectItem value="4.0">⭐ 4.0 ke atas</SelectItem>
                  <SelectItem value="3.5">⭐ 3.5 ke atas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Lokasi / Kota</label>
              <Input
                type="text"
                placeholder="Contoh: Jakarta"
                value={location}
                onChange={(e) => updateQueryParams({ location: e.target.value })}
              />
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600">Rentang Harga Maksimal</label>
              <Select value={priceMax} onValueChange={(val) => updateQueryParams({ priceMax: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Harga Maks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Semua Harga</SelectItem>
                  <SelectItem value="50000">Di bawah Rp 50.000</SelectItem>
                  <SelectItem value="100000">Di bawah Rp 100.000</SelectItem>
                  <SelectItem value="200000">Di bawah Rp 200.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Restaurants Grid */}
        {isLoadingList ? (
          <div className="flex h-60 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : restaurantsToShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {restaurantsToShow.map((resto) => (
              <RestaurantCard key={resto.id} restaurant={resto} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-dashed rounded-3xl space-y-3">
            <p className="text-slate-400 text-sm">Tidak menemukan restoran yang sesuai.</p>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              Reset Semua Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
