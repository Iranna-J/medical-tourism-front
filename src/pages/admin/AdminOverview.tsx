import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Activity, FileText, TrendingUp, DollarSign } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminOverview() {
    const [stats, setStats] = useState({
        hospitals: 0,
        doctors: 0,
        treatments: 0,
        inquiries: 0,
        bookings: 0,
        revenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await adminService.analytics.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsDisplay = [
        { name: 'Total Hospitals', value: stats.hospitals, icon: Building2, color: 'bg-blue-500' },
        { name: 'Total Doctors', value: stats.doctors, icon: Users, color: 'bg-purple-500' },
        { name: 'Total Treatments', value: stats.treatments, icon: Activity, color: 'bg-green-500' },
        { name: 'Total Inquiries', value: stats.inquiries, icon: FileText, color: 'bg-yellow-500' },
        { name: 'Total Bookings', value: stats.bookings, icon: TrendingUp, color: 'bg-pink-500' },
        { name: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-500' },
    ];

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage your medical tourism platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statsDisplay.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center gap-4">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{stat.name}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/admin/hospitals" className="p-4 border-2 border-gray-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition text-left">
                        <Building2 className="h-6 w-6 text-sky-600 mb-2" />
                        <p className="font-semibold text-gray-900">Manage Hospitals</p>
                        <p className="text-sm text-gray-600">Add, edit, or remove hospitals</p>
                    </Link>
                    <Link to="/admin/doctors" className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left">
                        <Users className="h-6 w-6 text-purple-600 mb-2" />
                        <p className="font-semibold text-gray-900">Manage Doctors</p>
                        <p className="text-sm text-gray-600">Add, edit, or remove doctors</p>
                    </Link>
                    <Link to="/admin/treatments" className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left">
                        <Activity className="h-6 w-6 text-green-600 mb-2" />
                        <p className="font-semibold text-gray-900">Manage Treatments</p>
                        <p className="text-sm text-gray-600">Add, edit, or remove treatments</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
