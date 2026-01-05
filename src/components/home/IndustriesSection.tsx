import { Factory, Zap, HardHat, Truck, FlaskConical } from 'lucide-react';

const industries = [
  {
    icon: Factory,
    name: 'Manufacturing',
    description: 'Production lines, assembly systems, and precision machinery for discrete and process manufacturing.',
    image: 'https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Zap,
    name: 'Energy',
    description: 'Power generation, transmission, and distribution equipment for conventional and renewable energy sectors.',
    image: 'https://images.pexels.com/photos/2101137/pexels-photo-2101137.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: HardHat,
    name: 'Construction',
    description: 'Heavy equipment, material handling, and infrastructure solutions for construction projects of any scale.',
    image: 'https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: Truck,
    name: 'Logistics',
    description: 'Warehousing systems, conveyor networks, and automated material handling for supply chain efficiency.',
    image: 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    icon: FlaskConical,
    name: 'Process Industries',
    description: 'Chemical processing, pharmaceutical, food & beverage, and water treatment equipment solutions.',
    image: 'https://images.pexels.com/photos/2760243/pexels-photo-2760243.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function IndustriesSection() {
  return (
    <section className="section-padding bg-charcoal-950 text-white">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Industries We Serve
          </h2>
          <p className="text-lg text-charcoal-400 max-w-2xl mx-auto">
            Delivering specialized equipment solutions across diverse industrial sectors,
            backed by application-specific expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden ${
                index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="absolute inset-0">
                <img
                  src={industry.image}
                  alt={industry.name}
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-transparent" />
              <div className="relative p-8 h-full min-h-64 flex flex-col justify-end">
                <div className="w-12 h-12 bg-steel-600/30 border border-steel-500/50 flex items-center justify-center mb-4">
                  <industry.icon className="w-6 h-6 text-steel-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">{industry.name}</h3>
                <p className="text-charcoal-400 text-sm leading-relaxed">
                  {industry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
