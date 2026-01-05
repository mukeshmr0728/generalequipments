import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, ArrowRight, Grid, List, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProductCategory, ProductWithCategory } from '../types/database';

const categoryImages: Record<string, string> = {
  'industrial-pumps': 'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=600',
  'compressors': 'https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=600',
  'conveyor-systems': 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600',
  'industrial-valves': 'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=600',
  'power-generation': 'https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=600',
  'material-handling': 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=600',
};

export default function ProductsPage() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const { data: categoriesData } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (categoriesData) setCategories(categoriesData);

      let productsQuery = supabase
        .from('products')
        .select('*, product_categories(*)')
        .eq('is_active', true)
        .order('name');

      if (categorySlug) {
        const category = categoriesData?.find(c => c.slug === categorySlug);
        if (category) {
          setCurrentCategory(category);
          productsQuery = productsQuery.eq('category_id', category.id);
        }
      } else {
        setCurrentCategory(null);
      }

      const { data: productsData } = await productsQuery;
      if (productsData) setProducts(productsData as ProductWithCategory[]);

      setLoading(false);
    }
    fetchData();
  }, [categorySlug]);

  return (
    <>
      <section className="bg-charcoal-950 text-white py-16">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-sm text-charcoal-400 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-white">Products</Link>
            {currentCategory && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{currentCategory.name}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {currentCategory ? currentCategory.name : 'Product Catalog'}
          </h1>
          <p className="text-xl text-charcoal-400 max-w-2xl">
            {currentCategory
              ? currentCategory.description
              : 'Comprehensive industrial equipment solutions engineered for reliability and performance.'}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="sticky top-28">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-500 mb-4">
                  Categories
                </h3>
                <nav className="space-y-1">
                  <Link
                    to="/products"
                    className={`block px-4 py-3 text-sm font-medium transition-colors ${
                      !categorySlug
                        ? 'bg-steel-700 text-white'
                        : 'text-charcoal-700 hover:bg-charcoal-100'
                    }`}
                  >
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products/category/${category.slug}`}
                      className={`block px-4 py-3 text-sm font-medium transition-colors ${
                        categorySlug === category.slug
                          ? 'bg-steel-700 text-white'
                          : 'text-charcoal-700 hover:bg-charcoal-100'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 p-6 bg-charcoal-50 border border-charcoal-200">
                  <h4 className="font-semibold text-charcoal-900 mb-2">
                    Need Assistance?
                  </h4>
                  <p className="text-sm text-charcoal-600 mb-4">
                    Our engineers can help you select the right equipment for your
                    application.
                  </p>
                  <Link to="/book-a-call" className="btn-primary w-full text-xs">
                    Speak with an Engineer
                  </Link>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <p className="text-charcoal-600">
                  {loading ? 'Loading...' : `${products.length} products`}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-charcoal-200' : 'hover:bg-charcoal-100'}`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-charcoal-200' : 'hover:bg-charcoal-100'}`}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-steel-600" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-charcoal-600">No products found in this category.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="group border border-charcoal-200 hover:border-steel-400 transition-colors"
                    >
                      <div className="aspect-video bg-charcoal-100 overflow-hidden">
                        <img
                          src={
                            product.featured_image ||
                            (product.product_categories?.slug
                              ? categoryImages[product.product_categories.slug]
                              : 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600')
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        {product.product_categories && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-steel-600 mb-2 block">
                            {product.product_categories.name}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-charcoal-900 mb-2 group-hover:text-steel-700 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-charcoal-600 line-clamp-2 mb-4">
                          {product.short_description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-steel-700 font-semibold text-sm uppercase tracking-wider">
                          View Details
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="group flex gap-6 border border-charcoal-200 hover:border-steel-400 transition-colors p-4"
                    >
                      <div className="w-48 h-32 bg-charcoal-100 flex-shrink-0 overflow-hidden">
                        <img
                          src={
                            product.featured_image ||
                            (product.product_categories?.slug
                              ? categoryImages[product.product_categories.slug]
                              : 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600')
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        {product.product_categories && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-steel-600 mb-1 block">
                            {product.product_categories.name}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-charcoal-900 mb-2 group-hover:text-steel-700 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-charcoal-600 line-clamp-2 mb-3">
                          {product.short_description}
                        </p>
                        <span className="inline-flex items-center gap-2 text-steel-700 font-semibold text-sm uppercase tracking-wider">
                          View Details
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
