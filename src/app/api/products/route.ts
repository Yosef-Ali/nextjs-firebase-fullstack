import { NextResponse } from 'next/server'
import { getFirestore } from '@/lib/firebaseAdmin'
import { Product } from '@/lib/types'

export async function GET() {
  try {
    const db = getFirestore()
    const productsRef = db.collection('products')
    const snapshot = await productsRef.get()
    
    const products: Product[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product))

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}