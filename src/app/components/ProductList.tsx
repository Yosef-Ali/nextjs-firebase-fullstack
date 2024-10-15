'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { Product } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]
        setProducts(fetchedProducts)
        setIsLoading(false)
      },
      (err) => {
        console.error('Error fetching products:', err)
        setError('An error occurred while fetching products.')
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id))
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  if (isLoading) {
    return <div className="text-center">Loading products...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <Link href="/add-product" className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
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
              <Link href={`/edit-product/${product.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
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
  )
}