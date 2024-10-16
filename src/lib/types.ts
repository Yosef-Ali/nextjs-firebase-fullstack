export interface Product {
  id: string
  name: string
  description?: string
  price: number
  imageUrl: string
  status: 'active' | 'inactive'
  stock: number
  totalSales: number
}