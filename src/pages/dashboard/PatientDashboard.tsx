import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, User, FileText, MessageSquare,
    Calendar, CreditCard, Star, Bell, LogOut,
    Activity, TrendingUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function PatientDashboard() {
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', href: '/dashboard/profile', icon: User },
        { name: 'Medical Reports', href: '/dashboard/reports', icon: FileText },
        { name: 'My Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
        { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
        { name: 'My Reviews', href: '/dashboard/reviews', icon: Star },
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    ];

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
                    {/* Logo/Header */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <Link to="/" className="flex items-center gap-2">
                            <Activity className="h-6 w-6 text-sky-600" />
                            <span className="font-bold text-gray-900">MediTravel</span>
                        </Link>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${active
                                            ? 'bg-sky-50 text-sky-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-700 hover:bg-gray-50 rounded-lg transition"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 lg:pl-64">
                    {/* Mobile Header */}
                    <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
                        <div className="flex items-center justify-between h-16 px-4">
                            <Link to="/" className="flex items-center gap-2">
                                <Activity className="h-6 w-6 text-sky-600" />
                                <span className="font-bold text-gray-900">MediTravel</span>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Link to="/dashboard/notifications" className="p-2 text-gray-600 hover:text-gray-900">
                                    <Bell className="h-6 w-6" />
                                </Link>
                                <button onClick={logout} className="p-2 text-gray-600 hover:text-gray-900">
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="p-6">
                        <Outlet />
                    </main>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
                <div className="grid grid-cols-4 gap-1 p-2">
                    {navigation.slice(0, 4).map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex flex-col items-center gap-1 py-2 rounded-lg transition ${active ? 'text-sky-600' : 'text-gray-600'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs">{item.name.split(' ')[0]}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
