import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useSidebarStore } from '../store/sidebarStore';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuthStore();
    const { toggleSidebar } = useSidebarStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isInDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard');

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        {isAuthenticated && isInDashboard && (
                            <button
                                onClick={toggleSidebar}
                                className="text-gray-700 hover:text-primary-600 p-2 mr-2 rounded-lg hover:bg-gray-100 transition"
                                title="Toggle Sidebar"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        )}
                        <Link to="/" className="flex items-center space-x-2">
                            <Heart className="h-8 w-8 text-primary-600" />
                            <span className="text-2xl font-bold text-primary-600">MediTravel</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/hospitals" className="text-gray-700 hover:text-primary-600 font-medium">
                            Hospitals
                        </Link>
                        <Link to="/doctors" className="text-gray-700 hover:text-primary-600 font-medium">
                            Doctors
                        </Link>
                        <Link to="/treatments" className="text-gray-700 hover:text-primary-600 font-medium">
                            Treatments
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-primary-600 font-medium">
                            About
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/hospitals" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                            Hospitals
                        </Link>
                        <Link to="/doctors" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                            Doctors
                        </Link>
                        <Link to="/treatments" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                            Treatments
                        </Link>
                        <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                            About
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-primary-50 rounded-md">
                                    Login
                                </Link>
                                <Link to="/register" className="block px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-md font-semibold">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
