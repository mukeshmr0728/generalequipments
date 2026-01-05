import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, Users, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import type { Lead, BookingRequest } from '../../types/database';

interface Stats {
  products: number;
  blogPosts: number;
  leads: number;
  bookings: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    blogPosts: 0,
    leads: 0,
    bookings: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [productsRes, postsRes, leadsRes, bookingsRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('booking_requests').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        products: productsRes.count || 0,
        blogPosts: postsRes.count || 0,
        leads: leadsRes.count || 0,
        bookings: bookingsRes.count || 0,
      });

      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: bookingsData } = await supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (leadsData) setRecentLeads(leadsData);
      if (bookingsData) setRecentBookings(bookingsData);

      setLoading(false);
    }
    fetchData();
  }, []);

  const statCards = [
    { name: 'Products', value: stats.products, icon: Package, href: '/admin/products', color: 'bg-steel-600' },
    { name: 'Blog Posts', value: stats.blogPosts, icon: FileText, href: '/admin/blog', color: 'bg-charcoal-700' },
    { name: 'Leads', value: stats.leads, icon: Users, href: '/admin/leads', color: 'bg-green-600' },
    { name: 'Bookings', value: stats.bookings, icon: Calendar, href: '/admin/bookings', color: 'bg-amber-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'contacted':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'qualified':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'closed':
      case 'cancelled':
        return 'bg-charcoal-100 text-charcoal-800';
      default:
        return 'bg-charcoal-100 text-charcoal-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Dashboard</h1>
        <p className="text-charcoal-600">
          Welcome to the General Equipments admin panel.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white border border-charcoal-200 p-6 hover:border-steel-400 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-charcoal-400" />
            </div>
            <div className="text-3xl font-bold text-charcoal-900 mb-1">
              {loading ? '-' : stat.value}
            </div>
            <div className="text-sm text-charcoal-600">{stat.name}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-charcoal-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
            <h2 className="font-semibold text-charcoal-900">Recent Leads</h2>
            <Link
              to="/admin/leads"
              className="text-sm text-steel-600 hover:text-steel-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-charcoal-200">
            {loading ? (
              <div className="p-6 text-center text-charcoal-500">Loading...</div>
            ) : recentLeads.length === 0 ? (
              <div className="p-6 text-center text-charcoal-500">No leads yet</div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="px-6 py-4">
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
                  <div className="text-xs text-charcoal-400">
                    {format(new Date(lead.created_at), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-charcoal-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal-200">
            <h2 className="font-semibold text-charcoal-900">Recent Bookings</h2>
            <Link
              to="/admin/bookings"
              className="text-sm text-steel-600 hover:text-steel-700 flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-charcoal-200">
            {loading ? (
              <div className="p-6 text-center text-charcoal-500">Loading...</div>
            ) : recentBookings.length === 0 ? (
              <div className="p-6 text-center text-charcoal-500">No bookings yet</div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="px-6 py-4">
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
                    {booking.topic || 'General Inquiry'}
                  </div>
                  <div className="text-xs text-charcoal-400">
                    {booking.preferred_date
                      ? format(new Date(booking.preferred_date), 'MMM d, yyyy')
                      : 'No date specified'}{' '}
                    {booking.preferred_time && `at ${booking.preferred_time}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
