import { Link } from 'react-router-dom';
import {
    MessageSquare, Calendar, FileText, Star,
    TrendingUp, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function DashboardOverview() {
    const { user } = useAuthStore();

    const stats = [
        { name: 'Active Inquiries', value: '0', icon: MessageSquare, color: 'bg-blue-500', link: '/dashboard/inquiries' },
        { name: 'Upcoming Bookings', value: '0', icon: Calendar, color: 'bg-green-500', link: '/dashboard/bookings' },
        { name: 'Medical Reports', value: '0', icon: FileText, color: 'bg-purple-500', link: '/dashboard/reports' },
        { name: 'Reviews Given', value: '0', icon: Star, color: 'bg-yellow-500', link: '/dashboard/reviews' },
    ];

    const recentActivity = [
        // Placeholder for recent activity
    ];

    const quickActions = [
        { name: 'Submit New Inquiry', icon: MessageSquare, link: '/dashboard/inquiries/new', color: 'bg-sky-500' },
        { name: 'Upload Medical Report', icon: FileText, link: '/dashboard/reports/upload', color: 'bg-purple-500' },
        { name: 'View My Bookings', icon: Calendar, link: '/dashboard/bookings', color: 'bg-green-500' },
        { name: 'Update Profile', icon: CheckCircle, link: '/dashboard/profile', color: 'bg-blue-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-sky-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-white/90 text-lg">
                    Manage your medical journey from one place
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.name}
                            to={stat.link}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">{stat.name}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.name}
                                to={action.link}
                                className="flex flex-col items-center gap-3 p-6 border-2 border-gray-200 rounded-lg hover:border-sky-500 hover:shadow-md transition"
                            >
                                <div className={`${action.color} p-4 rounded-full`}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-center font-medium text-gray-900">{action.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                <Clock className="h-5 w-5 text-gray-400 mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900">Activity Title</p>
                                    <p className="text-sm text-gray-600">Activity description</p>
                                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No recent activity</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Start by submitting an inquiry or uploading medical reports
                        </p>
                    </div>
                )}
            </div>

            {/* Help Section */}
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-sky-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-gray-600 mb-4">
                            Our support team is available 24/7 to assist you with your medical journey.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
