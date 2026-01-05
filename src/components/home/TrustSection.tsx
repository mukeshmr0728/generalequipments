import { Award, FileCheck, Handshake, Search } from 'lucide-react';

const trustItems = [
  {
    icon: Award,
    title: 'Industry Certifications',
    items: ['ISO 9001:2015 Certified', 'API Certified Products', 'ASME Compliance', 'CE Marking'],
  },
  {
    icon: FileCheck,
    title: 'Quality Standards',
    items: ['100% Incoming Inspection', 'Material Traceability', 'Performance Testing', 'Documentation Package'],
  },
  {
    icon: Handshake,
    title: 'Industry Partnerships',
    items: ['OEM Authorized Distributor', 'Manufacturer Direct', 'Global Sourcing Network', 'Technical Partnerships'],
  },
  {
    icon: Search,
    title: 'Inspection Protocols',
    items: ['Dimensional Verification', 'NDT Testing Available', 'Pressure Testing', 'Third-Party Inspection'],
  },
];

export default function TrustSection() {
  return (
    <section className="section-padding bg-charcoal-50">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Trust & Quality Assurance
          </h2>
          <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
            Our commitment to quality is documented, certified, and demonstrated through
            rigorous standards and transparent processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <div key={index} className="bg-white border border-charcoal-200 p-6">
              <div className="w-12 h-12 bg-steel-700 flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-4">
                {item.title}
              </h3>
              <ul className="space-y-3">
                {item.items.map((listItem, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-600">
                    <span className="w-1.5 h-1.5 bg-steel-600 rounded-full mt-2 flex-shrink-0" />
                    {listItem}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
