import { Link } from 'react-router-dom';
import { Phone, FileText, ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-padding bg-steel-700">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Discuss Your Equipment Needs?
          </h2>
          <p className="text-xl text-steel-200 mb-10 leading-relaxed">
            Our engineering team is ready to help you find the right equipment solution
            for your application. Let us understand your requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/book-a-call"
              className="btn bg-white text-steel-700 hover:bg-charcoal-100 gap-2 w-full sm:w-auto"
            >
              <Phone className="w-5 h-5" />
              Speak with an Engineer
            </Link>
            <Link
              to="/contact"
              className="btn-outline-white gap-2 w-full sm:w-auto"
            >
              <FileText className="w-5 h-5" />
              Request a Quote
            </Link>
          </div>

          <div className="mt-10 pt-10 border-t border-steel-600">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-steel-200 hover:text-white font-medium transition-colors"
            >
              Browse Our Product Catalog
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
