import { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  CalendarCheck,
  Users,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
  Settings,
  Home,
  Sparkles,
  FileText,
  Star,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Bảng điều khiển", end: true },
  { path: "/admin/hotels", icon: Building2, label: "Khách sạn" },
  { path: "/admin/rooms", icon: BedDouble, label: "Phòng" },
  { path: "/admin/amenities", icon: Sparkles, label: "Tiện nghi" },
  { path: "/admin/bookings", icon: CalendarCheck, label: "Đặt phòng" },
  { path: "/admin/users", icon: Users, label: "Người dùng" },
  { path: "/admin/blog", icon: FileText, label: "Blog" },
  { path: "/admin/support", icon: MessageCircle, label: "Hỗ trợ khách hàng" },
];

const formatTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_read_notifs") || "[]");
    } catch {
      return [];
    }
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const [bookingsRes, usersRes, reviewsRes] = await Promise.allSettled([
        api.getBookings({ limit: 10, sort: "-createdAt" }),
        api.getUsers({ limit: 10, sort: "-createdAt" }),
        api.getReviews({ limit: 10 }),
      ]);

      const notifs = [];

      if (bookingsRes.status === "fulfilled") {
        const bookings = bookingsRes.value?.data || bookingsRes.value?.bookings || bookingsRes.value || [];
        (Array.isArray(bookings) ? bookings : []).slice(0, 5).forEach((b) => {
          const guestName = b.guestInfo?.firstName
            ? `${b.guestInfo.firstName} ${b.guestInfo.lastName || ""}`.trim()
            : b.user?.name || "Khách";
          notifs.push({
            id: `booking-${b._id}`,
            type: "booking",
            message: `${guestName} vừa đặt phòng`,
            detail: b.hotel?.name || b.hotelName || "",
            time: b.createdAt,
            link: "/admin/bookings",
          });
        });
      }

      if (usersRes.status === "fulfilled") {
        const users = usersRes.value?.data || usersRes.value?.users || usersRes.value || [];
        (Array.isArray(users) ? users : [])
          .filter((u) => u.role !== "admin")
          .slice(0, 3)
          .forEach((u) => {
            notifs.push({
              id: `user-${u._id}`,
              type: "user",
              message: `${u.name} vừa đăng ký tài khoản`,
              detail: u.email || "",
              time: u.createdAt,
              link: "/admin/users",
            });
          });
      }

      if (reviewsRes.status === "fulfilled") {
        const reviews = reviewsRes.value?.data || reviewsRes.value || [];
        (Array.isArray(reviews) ? reviews : []).slice(0, 3).forEach((r) => {
          notifs.push({
            id: `review-${r._id}`,
            type: "review",
            message: `${r.userId?.name || "Khách"} đánh giá ${r.rating}★ cho ${r.hotelId?.name || "khách sạn"}`,
            detail: r.comment ? r.comment.slice(0, 50) + (r.comment.length > 50 ? "..." : "") : "",
            time: r.createdAt,
            link: "/admin/hotels",
          });
        });
      }

      notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
      setNotifications(notifs.slice(0, 10));
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const handleOpenNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  const markAllRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
    localStorage.setItem("admin_read_notifs", JSON.stringify(allIds));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#FF385C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-white font-semibold text-lg">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#FF385C] text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <Home size={20} />
            <span className="font-medium">Về trang chủ</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <Settings size={20} />
            <span className="font-medium">Cài đặt</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Left - Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Right - Notifications & Profile */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={handleOpenNotifications}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Thông báo</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-[#FF385C] hover:underline cursor-pointer"
                        >
                          Đánh dấu tất cả đã đọc
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-50">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-400 text-sm">
                          Không có thông báo nào
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const isRead = readIds.includes(notif.id);
                          return (
                            <Link
                              key={notif.id}
                              to={notif.link}
                              onClick={() => {
                                const newIds = [...new Set([...readIds, notif.id])];
                                setReadIds(newIds);
                                localStorage.setItem("admin_read_notifs", JSON.stringify(newIds));
                                setNotificationsOpen(false);
                              }}
                              className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!isRead ? "bg-blue-50/40" : ""}`}
                            >
                              <div className={`mt-0.5 p-2 rounded-full flex-shrink-0 ${
                                notif.type === "booking" ? "bg-green-100" :
                                notif.type === "user" ? "bg-purple-100" : "bg-amber-100"
                              }`}>
                                {notif.type === "booking" && <CalendarCheck size={14} className="text-green-600" />}
                                {notif.type === "user" && <Users size={14} className="text-purple-600" />}
                                {notif.type === "review" && <Star size={14} className="text-amber-500" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                                  {notif.message}
                                </p>
                                {notif.detail && (
                                  <p className="text-xs text-gray-400 mt-0.5 truncate">{notif.detail}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notif.time)}</p>
                              </div>
                              {!isRead && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              )}
                            </Link>
                          );
                        })
                      )}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                      <Link
                        to="/admin/bookings"
                        onClick={() => setNotificationsOpen(false)}
                        className="text-sm text-[#FF385C] hover:underline cursor-pointer font-medium"
                      >
                        Xem tất cả đặt phòng →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-[#FF385C] rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.name || "Admin"}
                  </span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Về trang chủ
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Tài khoản
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cài đặt
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
