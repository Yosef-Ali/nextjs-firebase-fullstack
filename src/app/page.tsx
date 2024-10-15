import ProductList from "./components/ProductList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl  mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Catalog</h1>
        <p className="text-gray-600 mb-6">Manage your products with real-time updates</p>
        <ProductList />
      </div>
    </div>
  )
}