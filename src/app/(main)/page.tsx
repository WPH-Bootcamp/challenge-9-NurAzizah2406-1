"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRestaurants, useRecommended, useNearby } from "@/lib/query/resto";
import { useAuthStore } from "@/store/auth";
import RestaurantCard from "@/components/shared/RestaurantCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, MapPin, X, Loader2, Award, Percent, Bike, Utensils, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

// Categories matching Figma design
const FigCategories = [
  { name: "All Restaurant", icon: Utensils, filter: "All" },
  { name: "Nearby", icon: MapPin, filter: "Nearby" },
  { name: "Discount", icon: Percent, filter: "Noodle" },
  { name: "Best Seller", icon: Award, filter: "BestSeller" },
  { name: "Delivery", icon: Bike, filter: "Delivery" },
  { name: "Lunch", icon: Coffee, filter: "Rice" },
];

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [limitToShow, setLimitToShow] = useState(6);

  // Filter states sync'd with URL
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "All";
  const rating = searchParams.get("rating") || "";
  const priceMin = searchParams.get("priceMin") || "";
  const priceMax = searchParams.get("priceMax") || "";
  const location = searchParams.get("location") || "";
  const isNearbyActive = searchParams.get("nearby") === "true";

  const [searchInput, setSearchInput] = useState(query);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

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

  const handleCategoryClick = (cat: typeof FigCategories[0]) => {
    if (cat.filter === "All") {
      router.push(pathname);
    } else if (cat.filter === "Nearby") {
      updateQueryParams({ nearby: isNearbyActive ? null : "true", category: null });
    } else if (cat.filter === "BestSeller") {
      updateQueryParams({ rating: "4.5", category: null, nearby: null });
    } else {
      updateQueryParams({ category: cat.filter, nearby: null });
    }
  };

  const handleResetFilters = () => {
    setSearchInput("");
    router.push(pathname);
  };

  // Queries
  const { data: recommendedData } = useRecommended({ limit: 12 });
  const { data: listData, isLoading: isLoadingList } = useRestaurants({
    category: category !== "All" && category !== "Nearby" && category !== "BestSeller" ? category : undefined,
    rating: rating ? parseFloat(rating) : undefined,
    priceMin: priceMin ? parseInt(priceMin) : undefined,
    priceMax: priceMax ? parseInt(priceMax) : undefined,
    location: location || undefined,
  });
  const { data: nearbyData } = useNearby({ range: 10, limit: 12 });

  // Compute what restaurants to display based on active filters
  let restaurants = listData?.data?.restaurants || [];

  if (isNearbyActive && mounted && token && nearbyData?.data?.restaurants) {
    restaurants = nearbyData.data.restaurants;
  } else if (category === "Nearby" && mounted && token && nearbyData?.data?.restaurants) {
    restaurants = nearbyData.data.restaurants;
  }

  // Filter list data further by search query locally
  const filteredRestaurants = restaurants.filter((resto) =>
    resto.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Section with Background Image */}
      <div className="relative h-[550px] md:h-[650px] w-full flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Cover Burger Image */}
        <Image
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&auto=format&fit=crop&q=80"
          alt="Culinary banner"
          fill
          className="object-cover object-center opacity-45 brightness-75"
          priority
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl px-4 text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Explore Culinary Experiences
          </h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-md mx-auto">
            Search and refine your choice to discover the perfect restaurant.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex max-w-lg mx-auto bg-white rounded-full p-1.5 shadow-lg border border-slate-100 gap-2 items-center">
            <div className="relative flex-grow pl-3 flex items-center">
              <Search className="text-slate-400 w-5 h-5 shrink-0" />
              <Input
                type="text"
                placeholder="Search restaurants, food and drink"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent text-slate-800 border-none shadow-none focus-visible:ring-0 h-10 w-full placeholder:text-slate-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    updateQueryParams({ q: null });
                  }}
                  className="text-slate-400 hover:text-slate-600 px-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button type="submit" className="bg-[#C12116] hover:bg-[#C12116]/90 text-white rounded-full h-10 px-6 font-bold cursor-pointer transition-colors duration-200">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Categories Grid Section */}
      <div className="container mx-auto px-4 py-8 -mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100/50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {FigCategories.map((cat) => {
              const IconComp = cat.icon;
              const isActive =
                cat.filter === "All"
                  ? !query && !rating && !priceMin && !priceMax && !location && !isNearbyActive && category === "All"
                  : cat.filter === "Nearby"
                  ? isNearbyActive
                  : category === cat.filter;

              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-[#C12116] bg-red-50/30 shadow-xs"
                      : "border-slate-100 bg-white hover:border-[#C12116]/40 hover:bg-slate-50/50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                    isActive ? "bg-[#C12116] text-white" : "bg-red-50 text-[#C12116]"
                  }`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Lists Section */}
      <div className="container mx-auto px-4 py-6 space-y-12 flex-grow">
        {/* Recommended Header / See All */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800">
              {isNearbyActive ? "Restoran Terdekat" : "Recommended"}
            </h2>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-slate-600 hover:text-[#C12116] hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <button
                onClick={() => updateQueryParams({ category: "All" })}
                className="text-[#C12116] hover:underline text-sm font-extrabold"
              >
                See All
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          {showFilters && (
            <div className="bg-white border border-slate-100 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Rating Minimum</label>
                <Select value={rating} onValueChange={(val) => updateQueryParams({ rating: val === "none" ? null : val })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none">Semua Rating</SelectItem>
                    <SelectItem value="4.5">⭐ 4.5 ke atas</SelectItem>
                    <SelectItem value="4.0">⭐ 4.0 ke atas</SelectItem>
                    <SelectItem value="3.5">⭐ 3.5 ke atas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Lokasi / Kota</label>
                <Input
                  type="text"
                  placeholder="Contoh: Jakarta"
                  value={location}
                  onChange={(e) => updateQueryParams({ location: e.target.value })}
                />
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Rentang Harga Maksimal</label>
                <Select value={priceMax} onValueChange={(val) => updateQueryParams({ priceMax: val === "none" ? null : val })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Harga Maks" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none">Semua Harga</SelectItem>
                    <SelectItem value="50000">Di bawah Rp 50.000</SelectItem>
                    <SelectItem value="100000">Di bawah Rp 100.000</SelectItem>
                    <SelectItem value="200000">Di bawah Rp 200.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Restaurant Grid */}
          {isLoadingList ? (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#C12116]" />
            </div>
          ) : filteredRestaurants.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredRestaurants.slice(0, limitToShow).map((resto) => (
                  <RestaurantCard key={resto.id} restaurant={resto} />
                ))}
              </div>

              {/* Show More Button */}
              {filteredRestaurants.length > limitToShow && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setLimitToShow((prev) => prev + 6)}
                    className="border-slate-200 hover:border-[#C12116] hover:text-[#C12116] rounded-full px-8 py-2 font-bold text-sm cursor-pointer"
                  >
                    Show More
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-dashed rounded-3xl space-y-4">
              <p className="text-slate-500 text-sm">Tidak menemukan restoran yang sesuai.</p>
              <Button variant="outline" size="sm" onClick={handleResetFilters} className="rounded-full">
                Reset Semua Filter
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Dark Premium Footer matching Figma */}
      <footer className="bg-[#0A0D12] text-[#FAFAFA] pt-16 pb-8 border-t border-slate-900 mt-16">
        <div className="container mx-auto px-4 space-y-12">
          {/* Main Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2">
                <svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="18" fill="#C12116" />
                  <circle cx="18" cy="18" r="5" fill="none" stroke="white" strokeWidth="2.5" />
                  <path d="M18 2V8M18 28V34M2 18H8M28 18H34" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                <span className="font-black text-xl tracking-tight text-white">Foody</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Enjoy homemade flavors & chef's signature dishes, freshly prepared every day. Order online or visit our nearest branch.
              </p>
              {/* Social links */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Follow on Social Media</span>
                <div className="flex items-center gap-3">
                  {["facebook", "instagram", "linkedin", "tiktok"].map((social) => (
                    <button
                      key={social}
                      className="w-8 h-8 rounded-full border border-slate-800 hover:border-[#C12116] flex items-center justify-center text-slate-400 hover:text-white transition-colors capitalize text-xs font-bold"
                    >
                      {social[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Explore column */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Explore</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">All Food</Link></li>
                <li><Link href="/?nearby=true" className="hover:text-white transition-colors">Nearby</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Discount</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Best Seller</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Delivery</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Lunch</Link></li>
              </ul>
            </div>

            {/* Help column */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-white uppercase tracking-wider">Help</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><span className="cursor-pointer hover:text-white transition-colors">How to Order</span></li>
                <li><span className="cursor-pointer hover:text-white transition-colors">Payment Methods</span></li>
                <li><span className="cursor-pointer hover:text-white transition-colors">Track My Order</span></li>
                <li><span className="cursor-pointer hover:text-white transition-colors">FAQ</span></li>
                <li><span className="cursor-pointer hover:text-white transition-colors">Contact Us</span></li>
              </ul>
            </div>
          </div>

          <Separator className="bg-slate-900" />

          {/* Bottom Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <span className="text-center sm:text-left">The ultimate Figma UI kit and design system</span>
            <span className="text-center sm:text-right">&copy; {new Date().getFullYear()} Web Programming Hack</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
