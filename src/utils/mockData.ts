export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  price: number;
}

export interface Warehouse {
  id: string;
  name: string;
  address: string;
  capacity: number;
  currentStock: number;
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

export const mockProducts: Product[] = [
  { id: 'P001', name: 'iPhone 16 Pro Max', imageUrl: 'https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2024/09/10/iphone-16-pro-max-titan-sa-mac-1.png', category: 'Smartphone', price: 1199 },
  { id: 'P002', name: 'MacBook Pro M3', imageUrl: 'https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2023/11/03/macbook-pro-m3-xam.png', category: 'Laptop', price: 1999 },
  { id: 'P003', name: 'AirPods Pro 2', imageUrl: 'https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2023/09/13/airpods-pro-2-type-c-1.png', category: 'Accessories', price: 249 },
  { id: 'P004', name: 'Apple Watch Ultra 2', imageUrl: 'https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2023/09/13/apple-watch-ultra-2-1.png', category: 'Smartwatch', price: 799 },
  { id: 'P005', name: 'iPad Pro M4', imageUrl: 'https://cdn.hoanghamobile.com/i/productlist/ts/Uploads/2024/05/08/ipad-pro-m4-13-inch-wifi.png', category: 'Tablet', price: 999 },
];

export const mockWarehouses: Warehouse[] = [
  { id: 'WH-HCM-01', name: 'Kho Thủ Đức - HCM', address: 'Khu Công Nghệ Cao, Thủ Đức, TP.HCM', capacity: 10000, currentStock: 4500 },
  { id: 'WH-HN-01', name: 'Kho Long Biên - HN', address: 'KCN Sài Đồng, Long Biên, Hà Nội', capacity: 8000, currentStock: 3200 },
  { id: 'WH-DN-01', name: 'Kho Liên Chiểu - ĐN', address: 'KCN Hòa Khánh, Liên Chiểu, Đà Nẵng', capacity: 5000, currentStock: 1100 },
];

export const mockInventory: InventoryItem[] = [
  { id: 'INV-001', productId: 'P001', productName: 'iPhone 16 Pro Max', warehouseId: 'WH-HCM-01', warehouseName: 'Kho Thủ Đức - HCM', quantity: 150 },
  { id: 'INV-002', productId: 'P001', productName: 'iPhone 16 Pro Max', warehouseId: 'WH-HN-01', warehouseName: 'Kho Long Biên - HN', quantity: 50 },
  { id: 'INV-003', productId: 'P002', productName: 'MacBook Pro M3', warehouseId: 'WH-HCM-01', warehouseName: 'Kho Thủ Đức - HCM', quantity: 30 },
  { id: 'INV-004', productId: 'P003', productName: 'AirPods Pro 2', warehouseId: 'WH-HN-01', warehouseName: 'Kho Long Biên - HN', quantity: 200 },
  { id: 'INV-005', productId: 'P004', productName: 'Apple Watch Ultra 2', warehouseId: 'WH-DN-01', warehouseName: 'Kho Liên Chiểu - ĐN', quantity: 10 }, // Low stock
  { id: 'INV-006', productId: 'P005', productName: 'iPad Pro M4', warehouseId: 'WH-HCM-01', warehouseName: 'Kho Thủ Đức - HCM', quantity: 5 }, // Low stock
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2024-1001',
    customerName: 'Nguyễn Văn A',
    totalAmount: 1448,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    items: [
      { productId: 'P001', productName: 'iPhone 16 Pro Max', quantity: 1, price: 1199 },
      { productId: 'P003', productName: 'AirPods Pro 2', quantity: 1, price: 249 }
    ],
    routings: [
      {
        shipmentId: 'SHIP-1001-A',
        warehouseId: 'WH-HCM-01',
        warehouseName: 'Kho Thủ Đức - HCM',
        items: [{ productId: 'P001', productName: 'iPhone 16 Pro Max', quantity: 1 }],
        status: 'PENDING'
      },
      {
        shipmentId: 'SHIP-1001-B',
        warehouseId: 'WH-HN-01',
        warehouseName: 'Kho Long Biên - HN',
        items: [{ productId: 'P003', productName: 'AirPods Pro 2', quantity: 1 }],
        status: 'PENDING'
      }
    ],
    sagaHistory: [
      { step: 'Order Created', status: 'SUCCESS', timestamp: '10:00:00 AM', message: 'Đơn hàng ORD-2024-1001 được tạo thành công' },
      { step: 'Payment Processed', status: 'SUCCESS', timestamp: '10:01:05 AM', message: 'Thanh toán 1448 USD qua VNPay thành công' },
      { step: 'Inventory Reserved', status: 'SUCCESS', timestamp: '10:01:10 AM', message: 'Giữ kho thành công (iPhone 16: HCM, AirPods: HN)' },
      { step: 'Order Confirmed', status: 'SUCCESS', timestamp: '10:01:15 AM', message: 'Xác nhận đơn hàng, chờ điều phối' }
    ]
  },
  {
    id: 'ORD-2024-1002',
    customerName: 'Trần Thị B',
    totalAmount: 1999,
    status: 'CANCELED',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Hôm qua
    items: [
      { productId: 'P002', productName: 'MacBook Pro M3', quantity: 1, price: 1999 }
    ],
    routings: [],
    sagaHistory: [
      { step: 'Order Created', status: 'SUCCESS', timestamp: '14:30:00 PM', message: 'Đơn hàng ORD-2024-1002 được tạo' },
      { step: 'Payment Processed', status: 'SUCCESS', timestamp: '14:31:00 PM', message: 'Thanh toán 1999 USD thành công' },
      { step: 'Inventory Reserved', status: 'FAILED', timestamp: '14:31:05 PM', message: 'Lỗi: Không đủ số lượng MacBook Pro M3 tại kho gần nhất' },
      { step: 'Payment Rollback', status: 'COMPENSATED', timestamp: '14:31:10 PM', message: 'Hoàn tiền 1999 USD qua VNPay' },
      { step: 'Order Canceled', status: 'SUCCESS', timestamp: '14:31:15 PM', message: 'Hủy đơn hàng thành công' }
    ]
  }
];

export const getChartData = () => {
  return [
    { name: 'Mon', orders: 4000, revenue: 2400 },
    { name: 'Tue', orders: 3000, revenue: 1398 },
    { name: 'Wed', orders: 2000, revenue: 9800 },
    { name: 'Thu', orders: 2780, revenue: 3908 },
    { name: 'Fri', orders: 1890, revenue: 4800 },
    { name: 'Sat', orders: 2390, revenue: 3800 },
    { name: 'Sun', orders: 3490, revenue: 4300 },
  ];
};
