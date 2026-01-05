import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ProductCategory } from '../../types/database';

const categoryImages: Record<string, string> = {
  'industrial-pumps': 'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=600',
  'compressors': 'https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=600',
  'conveyor-systems': 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600',
  'industrial-valves': 'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=600',
  'power-generation': 'https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=600',
  'material-handling': 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=600',
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-charcoal-50">
        <div className="container-wide flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-steel-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-charcoal-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Comprehensive industrial equipment solutions across multiple categories,
            engineered for reliability and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products/category/${category.slug}`}
              className="group bg-white border border-charcoal-200 hover:border-steel-400 transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={category.image_url || categoryImages[category.slug] || 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-charcoal-900 mb-2 group-hover:text-steel-700 transition-colors">
                  {category.name}
                </h3>
                <p className="text-charcoal-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center gap-2 text-steel-700 font-semibold text-sm uppercase tracking-wider">
                  View Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products" className="btn-outline">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
