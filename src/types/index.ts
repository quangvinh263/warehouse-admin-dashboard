export interface Product {
  id: string;
  name: string;
  imageUrl?: string;
  categoryId: string;
  categoryName: string;
  price: number;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentStock: number;
  inventories?: any[];
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface RoutingInfo {
  shipmentId: string;
  warehouseId: string;
  warehouseName: string;
  items: { productId: string; productName: string; quantity: number }[];
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED';
}

export interface SagaStep {
  step: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'COMPENSATED';
  timestamp: string;
  message: string;
}

export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  items: OrderItem[];
  routings: RoutingInfo[];
  sagaHistory: SagaStep[];
  createdAt: string;
}
