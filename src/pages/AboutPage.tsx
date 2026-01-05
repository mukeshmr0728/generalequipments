import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  Shield,
  Users,
  Award,
  Globe,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Reliability',
    description: 'We deliver equipment and service you can depend on, every time.',
  },
  {
    icon: Target,
    title: 'Precision',
    description: 'Exacting standards in selection, specification, and delivery.',
  },
  {
    icon: Users,
    title: 'Partnership',
    description: 'We succeed when our clients succeed. Long-term relationships matter.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Continuous improvement in everything we do.',
  },
];

const industries = [
  'Oil & Gas',
  'Chemical Processing',
  'Power Generation',
  'Water & Wastewater',
  'Food & Beverage',
  'Pharmaceutical',
  'Mining & Minerals',
  'Pulp & Paper',
  'Manufacturing',
  'Construction',
];

const certifications = [
  'ISO 9001:2015 Quality Management',
  'ISO 14001:2015 Environmental Management',
  'OHSAS 18001 Occupational Health & Safety',
  'API Monogram License',
  'ASME Certified Products',
  'CE Marking Compliance',
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-charcoal-950 text-white py-24">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Engineering Excellence Since 1998
            </h1>
            <p className="text-xl text-charcoal-300 leading-relaxed">
              General Equipments has built a reputation as a trusted industrial equipment
              supplier, serving diverse industries with precision, reliability, and
              technical expertise.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-charcoal-900 mb-6">
                Company Overview
              </h2>
              <div className="prose-industrial">
                <p>
                  Founded in 1998, General Equipments has grown from a regional equipment
                  supplier to a comprehensive industrial solutions provider serving clients
                  across multiple continents.
                </p>
                <p>
                  Our success is built on a foundation of technical competence, quality
                  products, and an unwavering commitment to customer satisfaction. We
                  understand that in industrial operations, equipment reliability is not
                  optional—it is essential.
                </p>
                <p>
                  With strategic partnerships with leading manufacturers and a team of
                  experienced engineers, we deliver solutions tailored to the specific
                  requirements of each application, backed by comprehensive technical
                  support.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Industrial facility"
                className="w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-steel-700 text-white p-6 max-w-xs">
                <div className="text-4xl font-bold mb-1">25+</div>
                <div className="text-sm text-steel-200 uppercase tracking-wider">
                  Years of Industrial Excellence
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-white border border-charcoal-200 p-8">
              <div className="w-14 h-14 bg-steel-700 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Our Mission</h3>
              <p className="text-charcoal-700 leading-relaxed">
                To provide industrial enterprises with reliable, high-quality equipment
                solutions supported by technical expertise, ensuring operational
                excellence and long-term value for our clients.
              </p>
            </div>
            <div className="bg-white border border-charcoal-200 p-8">
              <div className="w-14 h-14 bg-steel-700 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Our Vision</h3>
              <p className="text-charcoal-700 leading-relaxed">
                To be the preferred industrial equipment partner for enterprises seeking
                reliability, technical support, and supply chain excellence, recognized
                for our commitment to quality and customer success.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal-900 mb-4">Our Values</h2>
            <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
              The principles that guide our operations and relationships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-charcoal-100 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-steel-700" />
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-charcoal-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-950 text-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-steel-400" />
                <h2 className="text-3xl font-bold">Industries Served</h2>
              </div>
              <p className="text-charcoal-400 mb-8">
                We provide equipment solutions to a diverse range of industrial sectors,
                with application-specific expertise developed through decades of
                experience.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {industries.map((industry, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-steel-500 flex-shrink-0" />
                    <span className="text-charcoal-300">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-steel-400" />
                <h2 className="text-3xl font-bold">Certifications</h2>
              </div>
              <p className="text-charcoal-400 mb-8">
                Our commitment to quality is documented and verified through
                internationally recognized certifications and compliance standards.
              </p>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-charcoal-900/50 border border-charcoal-800 px-4 py-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-steel-500 flex-shrink-0" />
                    <span className="text-charcoal-300">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-50">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-charcoal-900 mb-4">
              Operational Philosophy
            </h2>
            <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
              How we approach equipment sourcing and supply.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-charcoal-200 p-8">
              <div className="text-4xl font-bold text-steel-700 mb-4">01</div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                Strategic Sourcing
              </h3>
              <p className="text-charcoal-600">
                We maintain relationships with qualified manufacturers worldwide,
                selecting partners based on quality, reliability, and technical
                capability.
              </p>
            </div>
            <div className="bg-white border border-charcoal-200 p-8">
              <div className="text-4xl font-bold text-steel-700 mb-4">02</div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                Quality Verification
              </h3>
              <p className="text-charcoal-600">
                Every product undergoes inspection and verification before delivery.
                Documentation packages ensure traceability and compliance.
              </p>
            </div>
            <div className="bg-white border border-charcoal-200 p-8">
              <div className="text-4xl font-bold text-steel-700 mb-4">03</div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                Technical Support
              </h3>
              <p className="text-charcoal-600">
                Our engineering team provides selection assistance, application
                support, and post-sale technical guidance throughout the equipment
                lifecycle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-steel-700 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold mb-6">
            Partner With General Equipments
          </h2>
          <p className="text-xl text-steel-200 mb-10 max-w-2xl mx-auto">
            Let us understand your equipment requirements and demonstrate how we can
            support your operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn bg-white text-steel-700 hover:bg-charcoal-100">
              Request a Quote
            </Link>
            <Link to="/products" className="btn-outline-white gap-2">
              Explore Our Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
