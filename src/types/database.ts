export type UserRole = "farmer" | "buyer" | "transporter" | "admin";

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export type DeliveryStatus = "assigned" | "in_transit" | "delivered";

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole | null;
  phone: string | null;
  location: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  farmer_id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: number;
  quantity: number;
  location: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  total_price: number | null;
  status: OrderStatus | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number | null;
  price: number | null;
}

export interface Delivery {
  id: string;
  order_id: string;
  transporter_id: string | null;
  status: DeliveryStatus | null;
  delivery_address: string | null;
  created_at: string;
}

export interface ProductWithFarmer extends Product {
  farmer?: Pick<Profile, "full_name" | "location"> | null;
}
