import { useEffect, useState } from 'react';
import { Search, Loader2, Mail, Phone, Building, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../types/database';

const statusOptions = ['new', 'contacted', 'qualified', 'closed'];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setLeads(data);
    setLoading(false);
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setLeads(leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    }
    setUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-amber-100 text-amber-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-charcoal-100 text-charcoal-800';
      default:
        return 'bg-charcoal-100 text-charcoal-800';
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Leads</h1>
        <p className="text-charcoal-600">Manage and track your leads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-charcoal-200">
            <div className="p-4 border-b border-charcoal-200 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-charcoal-300 focus:border-steel-500 focus:ring-2 focus:ring-steel-500 focus:ring-opacity-20 focus:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-charcoal-300 focus:border-steel-500 focus:ring-2 focus:ring-steel-500 focus:ring-opacity-20 focus:outline-none"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-steel-600 mx-auto" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-charcoal-500">
                No leads found
              </div>
            ) : (
              <div className="divide-y divide-charcoal-200 max-h-[600px] overflow-y-auto">
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`px-6 py-4 cursor-pointer hover:bg-charcoal-50 ${
                      selectedLead?.id === lead.id ? 'bg-steel-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-charcoal-900">{lead.name}</span>
                        {lead.company && (
                          <span className="text-charcoal-500 text-sm ml-2">
                            {lead.company}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="text-sm text-charcoal-600 mb-1">{lead.email}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-charcoal-400">
                        {lead.inquiry_type}
                      </span>
                      <span className="text-xs text-charcoal-400">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {selectedLead ? (
            <div className="bg-white border border-charcoal-200 sticky top-24">
              <div className="px-6 py-4 border-b border-charcoal-200">
                <h2 className="font-semibold text-charcoal-900">Lead Details</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-charcoal-900 mb-1">
                    {selectedLead.name}
                  </h3>
                  <span className={`text-xs font-medium px-2 py-1 ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-charcoal-400" />
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-steel-600 hover:text-steel-700"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-charcoal-400" />
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-steel-600 hover:text-steel-700"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  {selectedLead.company && (
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-charcoal-400" />
                      <span className="text-charcoal-700">{selectedLead.company}</span>
                    </div>
                  )}
                  {selectedLead.source_page && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-charcoal-400" />
                      <span className="text-charcoal-700 text-sm">{selectedLead.source_page}</span>
                    </div>
                  )}
                </div>

                {selectedLead.message && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
                      Message
                    </h4>
                    <p className="text-sm text-charcoal-700 bg-charcoal-50 p-4">
                      {selectedLead.message}
                    </p>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
                    Update Status
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedLead.id, status)}
                        disabled={updating || selectedLead.status === status}
                        className={`px-3 py-1 text-sm font-medium border transition-colors ${
                          selectedLead.status === status
                            ? 'bg-steel-700 text-white border-steel-700'
                            : 'border-charcoal-300 text-charcoal-700 hover:border-steel-500'
                        } disabled:opacity-50`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-charcoal-500">
                  Received: {format(new Date(selectedLead.created_at), 'MMMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-charcoal-50 border border-charcoal-200 p-12 text-center text-charcoal-500">
              Select a lead to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
