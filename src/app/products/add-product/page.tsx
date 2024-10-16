import ProductForm from "@/components/ProductForm";



export default function AddProduct() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <ProductForm/>
    </div>
  )
}