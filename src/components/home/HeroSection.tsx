import { Link } from 'react-router-dom';
import { ArrowRight, Phone, FileText } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-charcoal-950 text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/90 to-charcoal-950/70" />

      <div className="relative container-wide py-32 lg:py-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-steel-700/30 border border-steel-600/50 text-steel-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-steel-400 rounded-full animate-pulse" />
            Trusted by 500+ Industrial Operations
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Industrial Excellence,{' '}
            <span className="text-steel-400">Engineered Solutions</span>
          </h1>

          <p className="text-xl text-charcoal-300 leading-relaxed mb-10 max-w-2xl">
            Your trusted partner for industrial machinery and equipment. From pumps and
            compressors to complete material handling systems, we deliver reliability at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="btn bg-steel-600 text-white hover:bg-steel-700 gap-2"
            >
              <FileText className="w-5 h-5" />
              Request a Quote
            </Link>
            <Link
              to="/products"
              className="btn-outline-white gap-2"
            >
              View Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/book-a-call"
              className="btn border-2 border-transparent text-steel-300 hover:text-white gap-2"
            >
              <Phone className="w-5 h-5" />
              Book a Call
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
