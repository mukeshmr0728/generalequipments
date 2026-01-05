import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ProductWithCategory } from '../../types/database';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, product_categories(*)')
      .order('created_at', { ascending: false });

    if (data) setProducts(data as ProductWithCategory[]);
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleting(id);
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
    }
    setDeleting(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Products</h1>
          <p className="text-charcoal-600">Manage your product catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-charcoal-200 mb-6">
        <div className="p-4 border-b border-charcoal-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-charcoal-300 focus:border-steel-500 focus:ring-2 focus:ring-steel-500 focus:ring-opacity-20 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-steel-600 mx-auto" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500">
            {searchTerm ? 'No products found matching your search' : 'No products yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-charcoal-50 border-b border-charcoal-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Product
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Featured
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-charcoal-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-charcoal-900">{product.name}</div>
                      <div className="text-sm text-charcoal-500 truncate max-w-xs">
                        {product.short_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-600">
                      {product.product_categories?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-charcoal-100 text-charcoal-800'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 ${
                          product.is_featured
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-charcoal-100 text-charcoal-800'
                        }`}
                      >
                        {product.is_featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-charcoal-400 hover:text-steel-600"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="p-2 text-charcoal-400 hover:text-steel-600"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-charcoal-400 hover:text-red-600 disabled:opacity-50"
                        >
                          {deleting === product.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
