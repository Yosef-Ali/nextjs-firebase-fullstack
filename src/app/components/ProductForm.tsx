'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, addDoc, updateDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebaseClient'
import { Product } from '@/lib/types'

interface ProductFormProps {
  product?: Product
  onSubmit?: () => void
}

export default function ProductForm({ product, onSubmit }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    totalSales: 0,
    status: 'active',
  })
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' || name === 'totalSales' ? parseFloat(value) : value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = formData.imageUrl

      if (image) {
        const storageRef = ref(storage, `products/${image.name}`)
        await uploadBytes(storageRef, image)
        imageUrl = await getDownloadURL(storageRef)
      }

      const productData = { ...formData, imageUrl }

      if (product?.id) {
        await updateDoc(doc(db, 'products', product.id), productData)
      } else {
        await addDoc(collection(db, 'products'), productData)
      }

      setIsSubmitting(false)
      if (onSubmit) onSubmit()
      router.push('/')
    } catch (error) {
      console.error('Error submitting product:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="totalSales" className="block text-sm font-medium text-gray-700">Total Sales</label>
        <input
          type="number"
          id="totalSales"
          name="totalSales"
          value={formData.totalSales}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : (product ? 'Update Product' : 'Add Product')}
      </button>
    </form>
  )
}