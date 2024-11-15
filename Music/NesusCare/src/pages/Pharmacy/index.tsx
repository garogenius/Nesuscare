import { useState } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { FilterSection } from './components/FilterSection';
import { CartDrawer } from './components/CartDrawer';
import { Layout } from '../../components/layout/Layout';

const products = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    category: 'Pain Relief',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300&h=300',
    description: 'Effective pain relief for headaches, toothaches, and fever',
    prescription: false,
  },
  {
    id: 2,
    name: 'Vitamin C 1000mg',
    category: 'Vitamins',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?auto=format&fit=crop&q=80&w=300&h=300',
    description: 'Supports immune system health',
    prescription: false,
  },
  {
    id: 3,
    name: 'Blood Pressure Monitor',
    category: 'Medical Devices',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=300&h=300',
    description: 'Digital automatic blood pressure monitor',
    prescription: false,
  },
];

export default function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Online Pharmacy</h1>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-gray-300 pl-10 focus:border-rose-500 focus:ring-rose-500 sm:w-72"
            />
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart (0)
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <FilterSection />
        
        <div className="lg:col-span-3">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
    </Layout>
  );
}