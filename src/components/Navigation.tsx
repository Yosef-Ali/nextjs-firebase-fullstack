'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/') // Redirect to home page after sign out
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">My App</Link>
        <div>
          {user ? (
            <>
              <Link href="/products" className="text-white mr-4">Products</Link>
              <button onClick={handleSignOut} className="text-white">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-white mr-4">Sign In</Link>
              <Link href="/auth/signup" className="text-white">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}