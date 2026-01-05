import { useEffect, useState } from 'react';
import { Search, Loader2, Mail, Phone, Building, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { BookingRequest } from '../../types/database';

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    const { data } = await supabase
      .from('booking_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setBookings(data);
    setLoading(false);
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from('booking_requests')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    }
    setUpdating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-charcoal-100 text-charcoal-800';
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Booking Requests</h1>
        <p className="text-charcoal-600">Manage consultation booking requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-charcoal-200">
            <div className="p-4 border-b border-charcoal-200 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
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
            ) : filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-charcoal-500">
                No bookings found
              </div>
            ) : (
              <div className="divide-y divide-charcoal-200 max-h-[600px] overflow-y-auto">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className={`px-6 py-4 cursor-pointer hover:bg-charcoal-50 ${
                      selectedBooking?.id === booking.id ? 'bg-steel-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="font-medium text-charcoal-900">{booking.name}</span>
                        {booking.company && (
                          <span className="text-charcoal-500 text-sm ml-2">
                            {booking.company}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="text-sm text-charcoal-600 mb-1">
                      {booking.topic || 'General Consultation'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-charcoal-400">
                        {booking.preferred_date
                          ? format(new Date(booking.preferred_date), 'MMM d, yyyy')
                          : 'No date specified'}
                        {booking.preferred_time && ` at ${booking.preferred_time}`}
                      </span>
                      <span className="text-xs text-charcoal-400">
                        {format(new Date(booking.created_at), 'MMM d')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {selectedBooking ? (
            <div className="bg-white border border-charcoal-200 sticky top-24">
              <div className="px-6 py-4 border-b border-charcoal-200">
                <h2 className="font-semibold text-charcoal-900">Booking Details</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-charcoal-900 mb-1">
                    {selectedBooking.name}
                  </h3>
                  <span className={`text-xs font-medium px-2 py-1 ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-charcoal-400" />
                    <a
                      href={`mailto:${selectedBooking.email}`}
                      className="text-steel-600 hover:text-steel-700"
                    >
                      {selectedBooking.email}
                    </a>
                  </div>
                  {selectedBooking.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-charcoal-400" />
                      <a
                        href={`tel:${selectedBooking.phone}`}
                        className="text-steel-600 hover:text-steel-700"
                      >
                        {selectedBooking.phone}
                      </a>
                    </div>
                  )}
                  {selectedBooking.company && (
                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-charcoal-400" />
                      <span className="text-charcoal-700">{selectedBooking.company}</span>
                    </div>
                  )}
                  {selectedBooking.preferred_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-charcoal-400" />
                      <span className="text-charcoal-700">
                        {format(new Date(selectedBooking.preferred_date), 'MMMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  {selectedBooking.preferred_time && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-charcoal-400" />
                      <span className="text-charcoal-700">{selectedBooking.preferred_time}</span>
                    </div>
                  )}
                </div>

                {selectedBooking.topic && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
                      Topic
                    </h4>
                    <p className="text-sm text-charcoal-700">{selectedBooking.topic}</p>
                  </div>
                )}

                {selectedBooking.message && (
                  <div className="mb-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 mb-2">
                      Additional Details
                    </h4>
                    <p className="text-sm text-charcoal-700 bg-charcoal-50 p-4">
                      {selectedBooking.message}
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
                        onClick={() => handleStatusUpdate(selectedBooking.id, status)}
                        disabled={updating || selectedBooking.status === status}
                        className={`px-3 py-1 text-sm font-medium border transition-colors ${
                          selectedBooking.status === status
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
                  Requested: {format(new Date(selectedBooking.created_at), 'MMMM d, yyyy h:mm a')}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-charcoal-50 border border-charcoal-200 p-12 text-center text-charcoal-500">
              Select a booking to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
