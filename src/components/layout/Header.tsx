import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Cog } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { ProductCategory } from '../../types/database';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProductsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/products', hasDropdown: true },
    { name: 'Blogs', href: '/blog' },
    { name: 'Book a Call', href: '/book-a-call' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-steel-700 flex items-center justify-center">
              <Cog className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-charcoal-900 tracking-tight">
                General Equipments
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsProductsOpen(true)}
                    onMouseLeave={() => setIsProductsOpen(false)}
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center gap-1 text-sm font-semibold uppercase tracking-wider transition-colors ${
                        location.pathname.startsWith('/products')
                          ? 'text-steel-700'
                          : 'text-charcoal-700 hover:text-steel-700'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                    {isProductsOpen && categories.length > 0 && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="bg-white border border-charcoal-200 shadow-xl min-w-64">
                          <div className="py-2">
                            {categories.map((category) => (
                              <Link
                                key={category.id}
                                to={`/products/category/${category.slug}`}
                                className="block px-4 py-3 text-sm text-charcoal-700 hover:bg-charcoal-50 hover:text-steel-700 transition-colors"
                              >
                                {category.name}
                              </Link>
                            ))}
                            <div className="border-t border-charcoal-200 mt-2 pt-2">
                              <Link
                                to="/products"
                                className="block px-4 py-3 text-sm font-semibold text-steel-700 hover:bg-charcoal-50 transition-colors"
                              >
                                View All Products
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                      location.pathname === link.href
                        ? 'text-steel-700'
                        : 'text-charcoal-700 hover:text-steel-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link to="/contact" className="btn-primary">
              Request a Quote
            </Link>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-charcoal-900" />
            ) : (
              <Menu className="w-6 h-6 text-charcoal-900" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-charcoal-200 py-4">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.href}
                    className="block px-4 py-3 text-sm font-semibold uppercase tracking-wider text-charcoal-700 hover:bg-charcoal-50 hover:text-steel-700"
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && categories.length > 0 && (
                    <div className="pl-8 border-l-2 border-charcoal-200 ml-4">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/products/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-charcoal-600 hover:text-steel-700"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-4 pt-4">
                <Link to="/contact" className="btn-primary w-full">
                  Request a Quote
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
