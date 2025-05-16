import { useEffect, useState } from "react";
import { Bell, BellDot, X, CheckCircle, Clock, AlertCircle, Info, ChevronLeft, ChevronRight, Check, MoreVertical } from "lucide-react";
import { useAuth } from "../../../../auth/AuthContext.jsx";
import Loading from "../../../Components/loadingIndicator/loading.jsx";

const NotificationScreen = ({ theme, onClose }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [notificationsPerPage] = useState(8);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fetch notifications (same as original)
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/notifications/user/${user.email}`,
                { credentials: "include" }
            );
            const data = await response.json();
            if (data.success) setNotifications(data.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Mark as read (same as original)
    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/notifications/mark-as-read/${notificationId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.email }),
                }
            );

            if (response.ok) {
                setNotifications(prev => prev.map(n => {
                    if (n._id === notificationId) {
                        const updatedRecipients = n.recipients.map(r => {
                            if (r.userId === user.email) {
                                return { ...r, read: true, readAt: new Date() };
                            }
                            return r;
                        });
                        return { ...n, recipients: updatedRecipients };
                    }
                    return n;
                }));
            }
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    // Mark all as read (same as original)
    const markAllAsRead = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/notifications/mark-all-as-read`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.email }),
                }
            );

            if (response.ok) {
                setNotifications(prev => prev.map(n => {
                    const updatedRecipients = n.recipients.map(r => {
                        if (r.userId === user.email) {
                            return { ...r, read: true, readAt: new Date() };
                        }
                        return r;
                    });
                    return { ...n, recipients: updatedRecipients };
                }));
            }
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    // Handle notification action (same as original)
    const handleNotificationAction = async (notificationId, action) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/notifications/respond/${notificationId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        userId: user.email,
                        response: action,
                        responded: true
                    }),
                }
            );

            if (response.ok) {
                setNotifications(prev => prev.map(n => {
                    if (n._id === notificationId) {
                        const updatedRecipients = n.recipients.map(r => {
                            if (r.userId === user.email) {
                                return { ...r, responded: true, response: action };
                            }
                            return r;
                        });
                        return { ...n, recipients: updatedRecipients };
                    }
                    return n;
                }));
            }
        } catch (error) {
            console.error("Error handling notification action:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user?.email]);

    // Filter notifications
    const filteredNotifications = notifications.filter(notification => {
        const recipient = notification.recipients.find(r => r.userId === user.email);
        if (filter === 'all') return true;
        if (filter === 'unread') return !recipient?.read;
        if (filter === 'read') return recipient?.read;
        if (filter === 'action') return notification.actionRequired && !recipient?.responded;
        return true;
    });

    // Pagination logic
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification);
    const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

    // Helper functions
    const getNotificationIcon = (type) => {
        const icons = {
            success: <CheckCircle className="w-5 h-5 text-green-500" />,
            warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
            error: <AlertCircle className="w-5 h-5 text-red-500" />,
            info: <Info className="w-5 h-5 text-blue-500" />
        };
        return icons[type] || icons.info;
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: 'bg-gray-200 text-gray-800',
            medium: 'bg-blue-200 text-blue-800',
            high: 'bg-orange-200 text-orange-800',
            critical: 'bg-red-200 text-red-800'
        };
        return colors[priority] || colors.medium;
    };

    const getReadStatus = (notification) => {
        const recipient = notification.recipients.find(r => r.userId === user.email);
        return recipient?.read;
    };

    const getActionStatus = (notification) => {
        const recipient = notification.recipients.find(r => r.userId === user.email);
        return recipient?.responded ? recipient.response : null;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const getActionButtonStyle = (action) => {
        const base = "flex-1 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center space-x-2";
        if (action === 'approved') {
            return `${base} bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400`;
        } else {
            return `${base} bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400`;
        }
    };

    return (
        <div className={`fixed inset-0 z-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            {/* Header with glassmorphism effect */}
            <div className={`sticky top-0 z-10 p-4 border-b backdrop-blur-md ${theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={onClose} 
                            className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold">Notifications</h1>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={markAllAsRead}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-gray-100'}`}
                        >
                            Mark all read
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            
                            {isMenuOpen && (
                                <div 
                                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <button 
                                        onClick={markAllAsRead}
                                        className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                    >
                                        Mark all as read
                                    </button>
                                    <button 
                                        onClick={() => setFilter('unread')}
                                        className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                    >
                                        Show unread only
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Filter tabs - Horizontal scroll */}
                <div className="flex overflow-x-auto no-scrollbar mt-3 space-x-1">
                    {['all', 'unread', 'read', 'action'].map((tab) => {
                        const count = tab === 'unread' 
                            ? filteredNotifications.filter(n => !getReadStatus(n)).length 
                            : tab === 'action' 
                                ? filteredNotifications.filter(n => n.actionRequired && !getActionStatus(n)).length 
                                : null;
                                
                        return (
                            <button
                                key={tab}
                                onClick={() => {
                                    setFilter(tab);
                                    setCurrentPage(1);
                                }}
                                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                    filter === tab 
                                        ? theme === 'dark' 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-blue-500 text-white'
                                        : theme === 'dark' 
                                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tab === 'action' ? 'Action' : tab}
                                {count !== null && count > 0 && (
                                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-white/20">
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Notification list */}
            <div className="pb-20">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-pulse flex flex-col items-center">
                            <Bell className="w-12 h-12 text-gray-400" />
                            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Loading notifications...</p>
                        </div>
                    </div>
                ) : currentNotifications.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center h-64 p-6 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Bell className="w-16 h-16 mb-4 opacity-30" />
                        <p className="text-lg font-medium">
                            {filter === 'unread' ? "You're all caught up!" : 
                             filter === 'action' ? "No actions required" : 
                             "No notifications"}
                        </p>
                        <p className="text-sm mt-1">
                            {filter === 'all' ? "You'll see new notifications here" : "Check back later for updates"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1 p-2">
                        {currentNotifications.map((notification) => {
                            const isRead = getReadStatus(notification);
                            const actionStatus = getActionStatus(notification);
                            const recipient = notification.recipients.find(r => r.userId === user.email);
                            
                            return (
                                <div
                                    key={notification._id}
                                    onClick={() => {
                                        if (!isRead) markAsRead(notification._id);
                                        setSelectedNotification(notification);
                                    }}
                                    className={`relative p-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer ${
                                        !isRead 
                                            ? theme === 'dark' 
                                                ? 'bg-blue-900/20 hover:bg-blue-900/30' 
                                                : 'bg-blue-50 hover:bg-blue-100'
                                            : theme === 'dark' 
                                                ? 'hover:bg-gray-800/50' 
                                                : 'hover:bg-gray-50'
                                    } ${notification.actionRequired && !actionStatus ? 'ring-1 ring-yellow-500/30' : ''}`}
                                >
                                    {!isRead && (
                                        <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-blue-500"></div>
                                    )}
                                    
                                    <div className="flex items-start gap-3 pl-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className={`font-medium line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                
                                                <div className="flex items-center space-x-1.5">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(notification.priority)}`}>
                                                        {notification.priority}
                                                    </span>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {formatTime(notification.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <p className={`text-sm mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {notification.message}
                                            </p>
                                            
                                            {notification.actionRequired && !actionStatus && (
                                                <div className="flex space-x-2 mt-3">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNotificationAction(notification._id, 'approved');
                                                        }}
                                                        className="flex-1 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNotificationAction(notification._id, 'rejected');
                                                        }}
                                                        className="flex-1 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {notification.actionRequired && actionStatus && (
                                                <div className={`mt-2 text-xs px-2 py-1 rounded-lg inline-flex items-center ${
                                                    actionStatus === 'approved' 
                                                        ? theme === 'dark' 
                                                            ? 'bg-green-900/30 text-green-400' 
                                                            : 'bg-green-100 text-green-700'
                                                        : theme === 'dark' 
                                                            ? 'bg-red-900/30 text-red-400' 
                                                            : 'bg-red-100 text-red-700'
                                                }`}>
                                                    <Check className="w-3 h-3 mr-1" />
                                                    You {actionStatus} this request
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Bottom navigation with pagination */}
            <div className={`fixed bottom-0 left-0 right-0 p-4 border-t backdrop-blur-md ${theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'}`}>
                <div className="flex items-center justify-between">
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} ${
                                theme === 'dark' 
                                    ? 'hover:bg-gray-800 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-700'
                            } transition-colors`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage === 1) {
                                    pageNum = i + 1;
                                } else if (currentPage === totalPages) {
                                    pageNum = totalPages - 2 + i;
                                } else {
                                    pageNum = currentPage - 1 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium ${
                                            currentPage === pageNum 
                                                ? theme === 'dark' 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-blue-500 text-white'
                                                : theme === 'dark' 
                                                    ? 'hover:bg-gray-700 text-gray-300' 
                                                    : 'hover:bg-gray-100 text-gray-700'
                                        } transition-colors`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            
                            {totalPages > 3 && currentPage < totalPages - 1 && (
                                <span className={`px-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>...</span>
                            )}
                            
                            {totalPages > 3 && currentPage < totalPages - 1 && (
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium ${
                                        theme === 'dark' 
                                            ? 'hover:bg-gray-700 text-gray-300' 
                                            : 'hover:bg-gray-100 text-gray-700'
                                    } transition-colors`}
                                >
                                    {totalPages}
                                </button>
                            )}
                        </div>
                        
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} ${
                                theme === 'dark' 
                                    ? 'hover:bg-gray-800 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-700'
                            } transition-colors`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification detail view */}
            {selectedNotification && (
                <div className={`fixed inset-0 z-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className="flex flex-col h-full">
                        {/* Sticky header */}
                        <div className={`sticky top-0 p-4 border-b backdrop-blur-md flex items-center justify-between z-10 ${
                            theme === 'dark' ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'
                        }`}>
                            <button 
                                onClick={() => setSelectedNotification(null)}
                                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <h2 className="text-lg font-bold">Details</h2>
                            
                            <button 
                                onClick={onClose}
                                className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="max-w-lg mx-auto">
                                <div className="flex items-center gap-3 mb-6">
                                    {getNotificationIcon(selectedNotification.type)}
                                    <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedNotification.title}
                                    </h3>
                                </div>
                                
                                <div className={`p-5 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <p className={`whitespace-pre-line ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {selectedNotification.message}
                                    </p>
                                </div>
                                
                                {selectedNotification.actionRequired && (
                                    <div className={`mt-6 p-5 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                        <h4 className={`font-bold mb-4 flex items-center gap-2 ${
                                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            <span className={`w-2 h-2 rounded-full ${
                                                getActionStatus(selectedNotification) === 'approved' ? 'bg-green-500' :
                                                getActionStatus(selectedNotification) === 'rejected' ? 'bg-red-500' :
                                                'bg-yellow-500 animate-pulse'
                                            }`}></span>
                                            Action Required
                                        </h4>
                                        
                                        {getActionStatus(selectedNotification) ? (
                                            <div className={`p-4 rounded-lg mb-4 ${
                                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                                            }`}>
                                                <p className={`font-medium flex items-center gap-2 ${
                                                    getActionStatus(selectedNotification) === 'approved' 
                                                        ? theme === 'dark' 
                                                            ? 'text-green-400' 
                                                            : 'text-green-600'
                                                        : theme === 'dark' 
                                                            ? 'text-red-400' 
                                                            : 'text-red-600'
                                                }`}>
                                                    <CheckCircle className="w-4 h-4" />
                                                    You've {getActionStatus(selectedNotification)} this request
                                                </p>
                                                {recipient?.comments && (
                                                    <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {recipient.comments}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    Please review and respond to this request
                                                </p>
                                                
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button 
                                                        onClick={() => handleNotificationAction(selectedNotification._id, 'approved')}
                                                        className={getActionButtonStyle('approved')}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span>Approve</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleNotificationAction(selectedNotification._id, 'rejected')}
                                                        className={getActionButtonStyle('rejected')}
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Reject</span>
                                                    </button>
                                                </div>
                                                
                                                {selectedNotification.responseDeadline && (
                                                    <p className={`text-xs mt-3 flex items-center gap-1 ${
                                                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                                                    }`}>
                                                        <Clock className="w-3 h-3" />
                                                        Response required by: {new Date(selectedNotification.responseDeadline).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Metadata grid */}
                                <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <h4 className={`font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        Details
                                    </h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Date</p>
                                            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {new Date(selectedNotification.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Time</p>
                                            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {new Date(selectedNotification.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                                            <p className={`mt-1 text-sm capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {getReadStatus(selectedNotification) ? 'Read' : 'Unread'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Priority</p>
                                            <p className={`mt-1 text-sm capitalize ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedNotification.priority}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {selectedNotification.sender && (
                                        <div className="mt-4">
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Sender</p>
                                            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedNotification.sender.name} ({selectedNotification.sender.role})
                                            </p>
                                        </div>
                                    )}
                                    
                                    {selectedNotification.relatedEntity && (
                                        <div className="mt-4">
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Related to</p>
                                            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {selectedNotification.relatedEntity.type}: {selectedNotification.relatedEntity.id}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {selectedNotification.actionLink && (
                                        <div className="mt-6">
                                            <a 
                                                href={selectedNotification.actionLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${
                                                    theme === 'dark' 
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                                } transition-colors`}
                                            >
                                                View related item
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationScreen;