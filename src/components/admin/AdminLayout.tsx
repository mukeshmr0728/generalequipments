import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Cog,
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const currentPage = navigation.find((item) =>
    location.pathname.startsWith(item.href)
  );

  return (
    <div className="min-h-screen bg-charcoal-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal-950 transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 h-16 px-6 border-b border-charcoal-800">
          <div className="w-8 h-8 bg-steel-600 flex items-center justify-center">
            <Cog className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white">Admin CMS</span>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-steel-700 text-white'
                    : 'text-charcoal-400 hover:bg-charcoal-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-charcoal-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-steel-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email}
              </p>
              <p className="text-xs text-charcoal-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-charcoal-400 hover:bg-charcoal-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white border-b border-charcoal-200 h-16 flex items-center px-4 lg:px-8">
          <button
            className="lg:hidden p-2 mr-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2 text-sm text-charcoal-500">
            <span>Admin</span>
            {currentPage && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-charcoal-900 font-medium">
                  {currentPage.name}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-steel-600 hover:text-steel-700"
            >
              View Site
            </a>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
