export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl: string;
    totalSales: number;
    status: 'active' | 'out_of_stock';
  }