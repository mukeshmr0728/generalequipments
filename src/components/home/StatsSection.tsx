const stats = [
  { value: '25+', label: 'Years of Experience' },
  { value: '500+', label: 'Active Clients' },
  { value: '10,000+', label: 'Products Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
];

export default function StatsSection() {
  return (
    <section className="bg-white border-b border-charcoal-200">
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-steel-700 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-charcoal-600 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
