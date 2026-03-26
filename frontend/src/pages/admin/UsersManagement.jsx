import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Shield,
  X,
  Loader2,
} from "lucide-react";
import api from "../../services/api";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const formRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.getUsers({ limit: 200 });
        const data = res.data || res.users || res || [];
        setUsers(
          (Array.isArray(data) ? data : []).map((u) => ({
            ...u,
            id: u._id || u.id,
            status: u.status || "active",
            bookings: u.bookingCount || u.bookings || 0,
            joinedAt: u.createdAt ? u.createdAt.slice(0, 10) : "",
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const hasActiveFilters = roleFilter || statusFilter;

  const clearAllFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    setActiveDropdown(null);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.message || "Xóa thất bại");
    }
  };

  const handleAddNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const toggleStatus = async (id) => {
    setActiveDropdown(null);
    const user = users.find((u) => u.id === id);
    if (!user) return;
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      await api.updateUser(id, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u)),
      );
    } catch (err) {
      alert(err.message || "Cập nhật thất bại");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = formRef.current;
    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      role: form.role.value,
      status: form.status.value,
    };
    if (!editingUser) payload.password = form.password.value;
    try {
      if (editingUser) {
        const res = await api.updateUser(editingUser.id, payload);
        const updated = res.data || res;
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, ...payload, id: editingUser.id }
              : u,
          ),
        );
      } else {
        const res = await api.createUser(payload);
        const created = res.data || res;
        setUsers((prev) => [
          ...prev,
          {
            ...created,
            id: created._id || created.id,
            bookings: 0,
            joinedAt: new Date().toISOString().slice(0, 10),
          },
        ]);
      }
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] transition-colors cursor-pointer"
        >
          <Plus size={20} />
          Thêm người dùng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Tổng người dùng</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {users.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter((u) => u.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Quản trị viên</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <p className="text-sm text-gray-500">Tổng đặt phòng</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {users.reduce((a, b) => a + (b.bookings || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] cursor-pointer"
        >
          <option value="">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C] cursor-pointer"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[#FF385C] border border-[#FF385C] rounded-lg hover:bg-[#FF385C]/5 transition-colors cursor-pointer"
          >
            <X size={18} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Đang lọc:</span>
          {roleFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
              {roleFilter === "admin" ? "Quản trị viên" : "Người dùng"}
              <button
                onClick={() => {
                  setRoleFilter("");
                  setCurrentPage(1);
                }}
                className="p-0.5 hover:bg-[#FF385C]/20 rounded-full cursor-pointer"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
              {statusFilter === "active" ? "Hoạt động" : "Ngừng hoạt động"}
              <button
                onClick={() => {
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
                className="p-0.5 hover:bg-[#FF385C]/20 rounded-full cursor-pointer"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#FF385C]" />
          </div>
        )}
        <div className={`overflow-x-auto ${loading ? "hidden" : ""}`}>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Người dùng</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">
                  Liên hệ
                </th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">
                  Vai trò
                </th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">
                  Đặt phòng
                </th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 md:hidden">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1">
                      {user.role === "admin" && (
                        <Shield size={14} className="text-purple-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          user.role === "admin"
                            ? "text-purple-600"
                            : "text-gray-600"
                        }`}
                      >
                        {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-gray-700">{user.bookings}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.status === "active" ? "Hoạt động" : "Ngừng"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end relative">
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === user.id ? null : user.id,
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                      >
                        <MoreVertical size={18} className="text-gray-500" />
                      </button>

                      {activeDropdown === user.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                            <Eye size={16} />
                            Xem hồ sơ
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          >
                            <Edit size={16} />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => toggleStatus(user.id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          >
                            <Shield size={16} />
                            {user.status === "active"
                              ? "Vô hiệu hóa"
                              : "Kích hoạt"}
                          </button>
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
                            >
                              <Trash2 size={16} />
                              Xóa
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Hiển thị {paginatedUsers.length} / {filteredUsers.length} người dùng
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg cursor-pointer ${
                  currentPage === page
                    ? "bg-[#FF385C] text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <form
              ref={formRef}
              onSubmit={handleFormSubmit}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={editingUser?.name || ""}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={editingUser?.email || ""}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                  placeholder="Nhập địa chỉ email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={editingUser?.phone || ""}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vai trò
                  </label>
                  <select
                    name="role"
                    defaultValue={editingUser?.role || "user"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    defaultValue={editingUser?.status || "active"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Ngừng hoạt động</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editingUser ? "Lưu thay đổi" : "Thêm người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
