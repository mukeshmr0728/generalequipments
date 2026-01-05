import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Loader2, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ProductWithCategory, Product } from '../types/database';
import ProductInquiryForm from '../components/forms/ProductInquiryForm';

const categoryImages: Record<string, string> = {
  'industrial-pumps': 'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=800',
  'compressors': 'https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=800',
  'conveyor-systems': 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800',
  'industrial-valves': 'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=800',
  'power-generation': 'https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=800',
  'material-handling': 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=800',
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      const { data: productData, error } = await supabase
        .from('products')
        .select('*, product_categories(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error || !productData) {
        navigate('/products');
        return;
      }

      setProduct(productData as ProductWithCategory);

      if (productData.category_id) {
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', productData.category_id)
          .eq('is_active', true)
          .neq('id', productData.id)
          .limit(3);

        if (relatedData) setRelatedProducts(relatedData);
      }

      setLoading(false);
    }
    fetchProduct();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-steel-600" />
      </div>
    );
  }

  if (!product) return null;

  const specs = product.specifications as Record<string, unknown> | null;
  const imageUrl =
    product.featured_image ||
    (product.product_categories?.slug
      ? categoryImages[product.product_categories.slug]
      : 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800');

  return (
    <>
      <section className="bg-charcoal-950 text-white py-8">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-white">Products</Link>
            {product.product_categories && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link
                  to={`/products/category/${product.product_categories.slug}`}
                  className="hover:text-white"
                >
                  {product.product_categories.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-white truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-steel-700 font-medium mb-8 hover:text-steel-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square bg-charcoal-100 mb-4">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              {product.product_categories && (
                <Link
                  to={`/products/category/${product.product_categories.slug}`}
                  className="text-sm font-semibold uppercase tracking-wider text-steel-600 hover:text-steel-700 mb-2 block"
                >
                  {product.product_categories.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-charcoal-700 mb-8 leading-relaxed">
                {product.short_description}
              </p>

              {specs && Object.keys(specs).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal-500 mb-4">
                    Key Specifications
                  </h3>
                  <div className="border border-charcoal-200">
                    {Object.entries(specs).map(([key, value], index) => (
                      <div
                        key={key}
                        className={`flex ${index !== 0 ? 'border-t border-charcoal-200' : ''}`}
                      >
                        <div className="w-1/3 px-4 py-3 bg-charcoal-50 font-medium text-sm text-charcoal-700 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                        <div className="w-2/3 px-4 py-3 text-sm text-charcoal-900">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="btn-primary flex-1">
                  Request a Quote
                </Link>
                <Link to="/book-a-call" className="btn-outline flex-1">
                  Speak with an Engineer
                </Link>
              </div>
            </div>
          </div>

          {product.full_description && (
            <div className="mt-16 pt-16 border-t border-charcoal-200">
              <h2 className="text-2xl font-bold text-charcoal-900 mb-8">
                Product Details
              </h2>
              <div
                className="prose-industrial max-w-none"
                dangerouslySetInnerHTML={{ __html: product.full_description }}
              />
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-charcoal-900 mb-4">
                Product Inquiry
              </h2>
              <p className="text-charcoal-600 mb-8">
                Interested in this product? Submit an inquiry and our team will
                respond with pricing, availability, and technical information.
              </p>
              <ProductInquiryForm productId={product.id} productName={product.name} />
            </div>

            {relatedProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-charcoal-900 mb-4">
                  Related Products
                </h2>
                <div className="space-y-4">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      to={`/products/${relatedProduct.slug}`}
                      className="block bg-white border border-charcoal-200 p-4 hover:border-steel-400 transition-colors"
                    >
                      <h3 className="font-semibold text-charcoal-900 mb-1">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm text-charcoal-600 line-clamp-2">
                        {relatedProduct.short_description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
