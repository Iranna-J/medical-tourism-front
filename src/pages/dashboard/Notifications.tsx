import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, FileText, Calendar, DollarSign,
    Star, AlertCircle, Check, CheckCheck
} from 'lucide-react';
import { notificationService, type Notification } from '../../services/notificationService';
import toast from 'react-hot-toast';

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }

        // Navigate based on notification type
        if (notification.relatedId) {
            switch (notification.type) {
                case 'INQUIRY':
                    navigate(`/dashboard/inquiries/${notification.relatedId}`);
                    break;
                case 'ASSESSMENT':
                    navigate(`/dashboard/inquiries/${notification.relatedId}/assessment`);
                    break;
                case 'BOOKING':
                    navigate(`/dashboard/bookings/${notification.relatedId}`);
                    break;
                case 'PAYMENT':
                    navigate(`/dashboard/payments/${notification.relatedId}`);
                    break;
                default:
                    break;
            }
        }
    };

    const getNotificationIcon = (type: string) => {
        const icons = {
            INQUIRY: { icon: FileText, color: 'text-sky-600 bg-sky-100' },
            ASSESSMENT: { icon: AlertCircle, color: 'text-purple-600 bg-purple-100' },
            BOOKING: { icon: Calendar, color: 'text-blue-600 bg-blue-100' },
            PAYMENT: { icon: DollarSign, color: 'text-green-600 bg-green-100' },
            REVIEW: { icon: Star, color: 'text-yellow-600 bg-yellow-100' },
            SYSTEM: { icon: Bell, color: 'text-gray-600 bg-gray-100' },
        };
        return icons[type as keyof typeof icons] || icons.SYSTEM;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInHours * 60);
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    const filteredNotifications = notifications.filter(n =>
        filter === 'ALL' || (filter === 'UNREAD' && !n.isRead)
    );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-4">
                            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-md p-2 flex gap-2">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${filter === 'ALL'
                        ? 'bg-sky-100 text-sky-700'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    All ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('UNREAD')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${filter === 'UNREAD'
                        ? 'bg-sky-100 text-sky-700'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Unread ({unreadCount})
                </button>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {filter === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}
                    </h3>
                    <p className="text-gray-600">
                        {filter === 'UNREAD'
                            ? 'All your notifications have been read'
                            : 'You\'ll see notifications about your inquiries, bookings, and more here'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => {
                        const iconConfig = getNotificationIcon(notification.type);
                        const Icon = iconConfig.icon;

                        return (
                            <div
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition hover:shadow-lg ${!notification.isRead ? 'border-l-4 border-sky-500' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${iconConfig.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'
                                                }`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <span className="flex-shrink-0 w-2 h-2 bg-sky-500 rounded-full mt-2" />
                                            )}
                                        </div>
                                        <p className={`text-sm mb-2 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'
                                            }`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>{formatDate(notification.createdAt)}</span>
                                            <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                                                {notification.type}
                                            </span>
                                        </div>
                                    </div>
                                    {!notification.isRead && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(notification.id);
                                            }}
                                            className="flex-shrink-0 p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                                            title="Mark as read"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
