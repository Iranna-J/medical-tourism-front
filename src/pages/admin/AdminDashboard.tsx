import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Building2, Users, Activity, FileText,
    Settings, LogOut, Shield
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';

export default function AdminDashboard() {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const { isOpen } = useSidebarStore();

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Hospitals', href: '/admin/hospitals', icon: Building2 },
        { name: 'Doctors', href: '/admin/doctors', icon: Users },
        { name: 'Treatments', href: '/admin/treatments', icon: Activity },
        { name: 'Users', href: '/admin/users', icon: Shield },
        { name: 'Reports', href: '/admin/reports', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    const isActive = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'lg:w-64' : 'lg:w-0'
                    }`}>
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
                        <Link to="/" className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-sky-400" />
                            <span className="font-bold">Admin Panel</span>
                        </Link>
                    </div>

                    {/* User Info */}
                    <div className="p-6 border-b border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-sm text-gray-400 truncate">Administrator</p>
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
                                        ? 'bg-sky-600 text-white font-medium'
                                        : 'text-gray-300 hover:bg-gray-800'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-800 rounded-lg transition"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${isOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
