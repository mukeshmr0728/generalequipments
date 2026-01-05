import { Wrench, ShieldCheck, Truck, Headphones } from 'lucide-react';

const valueProps = [
  {
    icon: Wrench,
    title: 'Engineering Expertise',
    description: 'Our team of engineers brings decades of combined experience in industrial equipment selection, specification, and application support.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    description: 'Every product meets rigorous quality standards. We partner with ISO-certified manufacturers and conduct thorough inspection protocols.',
  },
  {
    icon: Truck,
    title: 'Supply Reliability',
    description: 'Strategic inventory management and established supplier relationships ensure consistent availability and on-time delivery.',
  },
  {
    icon: Headphones,
    title: 'Long-term Support',
    description: 'Our commitment extends beyond the sale. Technical support, spare parts, and maintenance guidance for the life of your equipment.',
  },
];

export default function ValuePropsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Why Choose General Equipments
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            We deliver more than equipment. We provide engineered solutions backed by
            expertise, quality, and unwavering commitment to your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valueProps.map((prop, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-steel-100 flex items-center justify-center mx-auto mb-6">
                <prop.icon className="w-8 h-8 text-steel-700" />
              </div>
              <h3 className="text-xl font-bold text-charcoal-900 mb-3">
                {prop.title}
              </h3>
              <p className="text-charcoal-600 leading-relaxed">
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
