'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import Link from 'next/link'
import Image from 'next/image'
import useProducts from '../hooks/useProducts'

export default function ProductList() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { products, loading, error, handleDelete } = useProducts(user)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
    }
  }, [user, authLoading, router])

  if (authLoading || loading) {
    return <div className="text-center">Loading products...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto space-y-6 pt-8">
        <Link href="/products/add-product" className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add New Product
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-lg object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              {product.description && (
                <p className="text-gray-600 mb-4">{product.description}</p>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                <span className={`text-sm ${product.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                  {product.status === 'active' ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Stock: {product.stock}</span>
                <span>Total Sales: {product.totalSales}</span>
              </div>
              <div className="flex justify-between">
                <Link href={`/products/edit/${product.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}