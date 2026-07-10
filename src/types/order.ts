export interface OrderItem {
  menuId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface OrderRestaurant {
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
  totalPrice: number;
  restaurants: OrderRestaurant[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutItemPayload {
  menuId: string;
  quantity: number;
}

export interface CheckoutRestaurantPayload {
  restaurantId: string;
  items: CheckoutItemPayload[];
}

export interface CheckoutPayload {
  restaurants: CheckoutRestaurantPayload[];
  deliveryAddress: string;
  phone?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface PaginatedOrderResponse {
  message: string;
  data: Order[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
