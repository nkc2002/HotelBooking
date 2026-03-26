import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Eye,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BedDouble,
  ChevronRight,
} from "lucide-react";
import api from "../../services/api";

const getStatusConfig = (status) => {
  switch (status) {
    case "confirmed":
      return { label: "Đã xác nhận", color: "bg-green-100 text-green-700", icon: CheckCircle };
    case "pending":
      return { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700", icon: Clock };
    case "completed":
      return { label: "Hoàn thành", color: "bg-blue-100 text-blue-700", icon: CheckCircle };
    case "cancelled":
      return { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: XCircle };
    default:
      return { label: status, color: "bg-gray-100 text-gray-700", icon: AlertCircle };
  }
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, link }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <ArrowUpRight size={16} className="text-green-500" />
            <span className="text-sm font-medium text-green-600">{trendValue}</span>
            <span className="text-xs text-gray-400">so với tháng trước</span>
          </div>
        )}
      </div>
      <div className={`p-3.5 rounded-xl ${color}`}>
        <Icon size={26} className="text-white" />
      </div>
    </div>
    {link && (
      <Link
        to={link}
        className="inline-flex items-center gap-1 text-sm text-[#FF385C] font-medium mt-4 hover:underline"
      >
        Xem chi tiết
        <ChevronRight size={16} />
      </Link>
    )}
  </div>
);

const MiniBarChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-3 h-40">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">
            ${Math.round(item.revenue / 1000)}k
          </span>
          <div
            className="w-full bg-[#FF385C]/80 rounded-t hover:bg-[#FF385C] transition-colors cursor-pointer"
            style={{ height: `${(item.revenue / maxValue) * 100}%` }}
            title={`${item.month}: $${item.revenue.toLocaleString()}`}
          />
          <span className="text-sm text-gray-500">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [activeBookingMenu, setActiveBookingMenu] = useState(null);
  const [stats, setStats] = useState({
    hotels: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
    rooms: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [hotelsRes, bookingsRes, usersRes] = await Promise.all([
          api.getHotels({ limit: 100 }),
          api.getBookings({ limit: 100, sort: "-createdAt" }),
          api.getUsers({ limit: 100 }),
        ]);

        const hotels = hotelsRes.data || hotelsRes.hotels || hotelsRes || [];
        const bookings = bookingsRes.data || bookingsRes.bookings || bookingsRes || [];
        const users = usersRes.data || usersRes.users || usersRes || [];

        const hotelList = Array.isArray(hotels) ? hotels : [];
        const bookingList = Array.isArray(bookings) ? bookings : [];
        const userList = Array.isArray(users) ? users : [];

        const totalRevenue = bookingList
          .filter((b) => b.status !== "cancelled")
          .reduce((sum, b) => sum + (b.totalPrice || b.amount || 0), 0);

        const totalRooms = hotelList.reduce((sum, h) => sum + (h.totalRooms || 0), 0);

        setStats({
          hotels: hotelList.length,
          bookings: bookingList.length,
          users: userList.filter((u) => u.role !== "admin").length,
          revenue: totalRevenue,
          rooms: totalRooms,
        });

        const recent = bookingList.slice(0, 5).map((b) => ({
          _id: b._id || b.id,
          guestName: b.guestInfo?.firstName
            ? `${b.guestInfo.firstName} ${b.guestInfo.lastName || ""}`.trim()
            : b.user?.name || b.guestName || "Guest",
          guestEmail: b.guestInfo?.email || b.user?.email || b.guestEmail || "",
          hotelName: b.hotel?.name || b.hotelName || "Hotel",
          roomTitle: b.room?.title || b.roomTitle || "Room",
          checkIn: b.checkInDate || b.checkIn,
          checkOut: b.checkOutDate || b.checkOut,
          totalPrice: b.totalPrice || b.amount || 0,
          status: b.status || "pending",
          createdAt: b.createdAt,
        }));
        setRecentBookings(recent);

        const revenueByMonth = {};
        bookingList.forEach((b) => {
          if (b.status === "cancelled") return;
          const date = new Date(b.createdAt || b.checkInDate);
          if (isNaN(date)) return;
          const monthKey = `T${date.getMonth() + 1}`;
          revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + (b.totalPrice || 0);
        });

        const months = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];
        const now = new Date();
        const last6 = months.slice(Math.max(0, now.getMonth() - 5), now.getMonth() + 1);
        setMonthlyRevenue(last6.map((m) => ({ month: m, revenue: revenueByMonth[m] || 0 })));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const pendingBookings = recentBookings.filter((b) => b.status === "pending").length;

  const handleConfirmBooking = async (bookingId) => {
    try {
      await api.updateBooking(bookingId, { status: "confirmed" });
      setRecentBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, status: "confirmed" } : b)
      );
    } catch (err) {
      alert(err.message || "Xác nhận thất bại");
    }
    setActiveBookingMenu(null);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.cancelBooking(bookingId);
      setRecentBookings((prev) =>
        prev.map((b) => b._id === bookingId ? { ...b, status: "cancelled" } : b)
      );
    } catch (err) {
      alert(err.message || "Hủy thất bại");
    }
    setActiveBookingMenu(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#FF385C] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.
          </p>
        </div>
      </div>

      {pendingBookings > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <AlertCircle size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Bạn có {pendingBookings} đặt phòng đang chờ xử lý
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Vui lòng xác nhận hoặc từ chối các đơn đặt phòng
            </p>
          </div>
          <Link
            to="/admin/bookings"
            className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Xem ngay
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.hotels}</p>
              <p className="text-sm text-gray-500">Tổng khách sạn</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CalendarCheck size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.bookings}</p>
              <p className="text-sm text-gray-500">Tổng đặt phòng</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.users}</p>
              <p className="text-sm text-gray-500">Người dùng</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF385C]/10 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-[#FF385C]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#FF385C]">${stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Doanh thu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Doanh thu theo tháng
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Tổng quan doanh thu 6 tháng gần nhất
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp size={18} className="text-green-500" />
              <span className="text-green-600 font-medium">Thực tế</span>
            </div>
          </div>
          <MiniBarChart data={monthlyRevenue} />
          {monthlyRevenue.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Tổng 6 tháng</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Trung bình/tháng</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / 6).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Thống kê nhanh
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <BedDouble size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Tổng số phòng</p>
                  <p className="text-xs text-gray-500">Tất cả khách sạn</p>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">{stats.rooms}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-100 rounded-lg">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Đã xác nhận</p>
                  <p className="text-xs text-gray-500">Đặt phòng gần đây</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600">
                {recentBookings.filter((b) => b.status === "confirmed").length}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <Clock size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Chờ xử lý</p>
                  <p className="text-xs text-gray-500">Cần xác nhận</p>
                </div>
              </div>
              <span className="text-xl font-bold text-amber-600">{pendingBookings}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-100 rounded-lg">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Đã hủy</p>
                  <p className="text-xs text-gray-500">Gần đây</p>
                </div>
              </div>
              <span className="text-xl font-bold text-red-600">
                {recentBookings.filter((b) => b.status === "cancelled").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Đặt phòng gần đây
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {recentBookings.length} đơn đặt phòng mới nhất
              </p>
            </div>
            <Link
              to="/admin/bookings"
              className="text-sm text-[#FF385C] font-medium hover:underline flex items-center gap-1"
            >
              Xem tất cả
              <ChevronRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 font-medium">Mã đơn</th>
                  <th className="px-6 py-4 font-medium">Khách hàng</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Khách sạn</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Số tiền</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900 text-sm">
                          {booking._id?.slice(-8) || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.guestName}</p>
                          <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div>
                          <p className="text-sm text-gray-900">{booking.hotelName}</p>
                          <p className="text-sm text-gray-500">{booking.roomTitle}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="font-semibold text-gray-900">
                          ${booking.totalPrice}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                        >
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end relative">
                          <button
                            onClick={() =>
                              setActiveBookingMenu(
                                activeBookingMenu === booking._id ? null : booking._id
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                          >
                            <MoreHorizontal size={18} className="text-gray-500" />
                          </button>
                          {activeBookingMenu === booking._id && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <Link
                                to="/admin/bookings"
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              >
                                <Eye size={16} />
                                Xem chi tiết
                              </Link>
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleConfirmBooking(booking._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <CheckCircle size={16} />
                                    Xác nhận
                                  </button>
                                  <button
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                                  >
                                    <XCircle size={16} />
                                    Từ chối
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            Thao tác nhanh
          </h2>
          <div className="space-y-3">
            <Link
              to="/admin/hotels"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="p-2.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Thêm khách sạn</p>
                <p className="text-sm text-gray-500">Tạo khách sạn mới</p>
              </div>
            </Link>
            <Link
              to="/admin/rooms"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="p-2.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <BedDouble size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Quản lý phòng</p>
                <p className="text-sm text-gray-500">Xem danh sách phòng</p>
              </div>
            </Link>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group"
            >
              <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <CalendarCheck size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Đặt phòng</p>
                <p className="text-sm text-gray-500">Xem tất cả đơn</p>
              </div>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors group"
            >
              <div className="p-2.5 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                <Users size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Người dùng</p>
                <p className="text-sm text-gray-500">Quản lý tài khoản</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
