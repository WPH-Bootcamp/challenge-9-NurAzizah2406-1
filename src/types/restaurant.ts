export interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  category: string;
  image: string;
  rating: number;
  priceMin: number;
  priceMax: number;
  distance?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Menu {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  transactionId: string;
  star: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
  };
}

export interface RestaurantDetail extends Restaurant {
  menus: Menu[];
  reviews: Review[];
}

export interface RestaurantListParams {
  location?: string;
  range?: number;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    restaurants: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
