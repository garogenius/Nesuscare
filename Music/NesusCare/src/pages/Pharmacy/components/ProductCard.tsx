import { ShoppingCart, AlertCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  prescription: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {product.category}
          </span>
        </div>

        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.prescription ? (
            <div className="flex items-center text-amber-600">
              <AlertCircle className="mr-1 h-4 w-4" />
              <span className="text-xs">Prescription required</span>
            </div>
          ) : (
            <button className="inline-flex items-center rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}