export interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  rating?: number;
}

export interface NewProduct extends Omit<Product, "id"> {}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  totalOrders?: number;
  orders?: Order[];
}

export interface Purchase {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  note?: string;
  timestamp: string;
  product?: Product; // <-- added for `include: { product: true }` support
}

export interface NewPurchase {
  productId: string;
  quantity: number;
  unitCost: number;
  note?: string;
  timestamp?: string; // optional, backend generates if not provided
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  note?: string;
  timestamp: string;
}

export interface NewExpense {
  category: string;
  amount: number;
  note?: string;
  timestamp?: string;
}

export interface Order {
  id: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  paymentStatus: string;
  total: number;
  customer: Customer;
  items: Item[];
}

export interface Item {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: Product;
}

export interface NewOrder {
  customer?: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  customerId?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  recentSales: Order[];
}

export interface PurchaseSummary {
  totalPurchaseCost: number;
  totalPurchases: number;
}

export interface OrderSummary {
  total: number;
  pending: number;
  processed: number;
}

export interface CustomerGrowth {
  total: number;
  last7Days: number;
  last30Days: number;
}

export interface ExpenseCategoryBreakdown {
  category: string;
  _sum: {
    amount: number;
  };
}

export interface ExpenseSummary {
  total: number;
  breakdown: ExpenseCategoryBreakdown[];
}

export interface PopularProduct {
  product: Product;
  sold: number;
}
