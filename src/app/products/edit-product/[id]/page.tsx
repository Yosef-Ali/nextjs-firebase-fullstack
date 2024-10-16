'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { Product } from '@/lib/types'
import ProductForm from '@/components/ProductForm'

export default function EditProduct() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      if (typeof id !== 'string') return
      const docRef = doc(db, 'products', id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product)
      }
      setIsLoading(false)
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return <div className="text-center">Loading product...</div>
  }

  if (!product) {
    return <div className="text-center">Product not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}