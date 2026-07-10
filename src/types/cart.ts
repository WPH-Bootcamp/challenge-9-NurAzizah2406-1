export interface CartMenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  menuId: string;
  quantity: number;
  menu: CartMenuItem;
}

export interface Cart {
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
}

export interface AddToCartPayload {
  restaurantId: string;
  menuId: string;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}
