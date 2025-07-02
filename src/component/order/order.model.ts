// src/app/interfaces/order.model.ts
export interface OrderItem {
  product: string; // product _id
  quantity: number;
}

export interface Order {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  customerInfo: {
    fullName: string;
    phoneNumber: string;
    address: string;
  };
}
