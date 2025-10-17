import { Settings as SettingsIcon, Bell, Lock, Globe, Mail, Database } from 'lucide-react';

export default function Settings() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage system settings and configurations</p>
            </div>

            {/* Coming Soon Message */}
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Coming Soon</h3>
                <p className="text-gray-600 mb-6">
                    System configuration and settings features are currently under development.
                </p>
            </div>

            {/* Placeholder Settings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <Bell className="h-8 w-8 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Configure email and push notification settings
                    </p>
                    <button disabled className="text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <Lock className="h-8 w-8 text-red-600" />
                        <h3 className="font-semibold text-gray-900">Security</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Manage security settings and access controls
                    </p>
                    <button disabled className="text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe className="h-8 w-8 text-green-600" />
                        <h3 className="font-semibold text-gray-900">Localization</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Configure language, timezone, and regional settings
                    </p>
                    <button disabled className="text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <Mail className="h-8 w-8 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">Email Templates</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Customize email templates and messaging
                    </p>
                    <button disabled className="text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="h-8 w-8 text-yellow-600" />
                        <h3 className="font-semibold text-gray-900">Data Management</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Backup, restore, and manage system data
                    </p>
                    <button disabled className="text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 opacity-50">
                    <div className="flex items-center gap-3 mb-4">
                        <SettingsIcon className="h-8 w-8 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">General Settings</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        Configure general system preferences
                    </p>
                    <button disabled className="text-sm text-gray-400 cursor-not-allowed">
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    );
}
