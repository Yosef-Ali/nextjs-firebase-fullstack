import { useState, useEffect } from 'react'
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebaseClient'
import { Product } from '@/lib/types'

const useProducts = (user: any) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const fetchedProducts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[]
        setProducts(fetchedProducts)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching products:', err)
        setError('An error occurred while fetching products.')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id))
        setProducts(products.filter(product => product.id !== id))
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  return { products, loading, error, handleDelete }
}

export default useProducts