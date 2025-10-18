import { FileText, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export default function Reports() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">View detailed reports and analytics</p>
            </div>

            {/* Coming Soon Message */}
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports Coming Soon</h3>
                <p className="text-gray-600 mb-6">
                    Advanced reporting and analytics features are currently under development.
                </p>
            </div>

            {/* Placeholder Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Revenue Report</h3>
                    </div>
                    <p className="text-sm text-gray-600">Track revenue trends and financial performance</p>
                    <button disabled className="mt-4 text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <Users className="h-8 w-8 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">User Activity</h3>
                    </div>
                    <p className="text-sm text-gray-600">Monitor user engagement and activity patterns</p>
                    <button disabled className="mt-4 text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        <h3 className="font-semibold text-gray-900">Payment Analytics</h3>
                    </div>
                    <p className="text-sm text-gray-600">Analyze payment trends and transaction data</p>
                    <button disabled className="mt-4 text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="h-8 w-8 text-yellow-600" />
                        <h3 className="font-semibold text-gray-900">Booking Trends</h3>
                    </div>
                    <p className="text-sm text-gray-600">View booking patterns and seasonal trends</p>
                    <button disabled className="mt-4 text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-8 w-8 text-red-600" />
                        <h3 className="font-semibold text-gray-900">Custom Reports</h3>
                    </div>
                    <p className="text-sm text-gray-600">Generate custom reports based on your needs</p>
                    <button disabled className="mt-4 text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="h-8 w-8 text-pink-600" />
                        <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
                    </div>
                    <p className="text-sm text-gray-600">Track key performance indicators</p>
                    <button disabled className="mt-4 text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    );
}
