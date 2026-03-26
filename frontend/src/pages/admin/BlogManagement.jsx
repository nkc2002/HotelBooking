import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ChevronDown,
  X,
} from "lucide-react";
import {
  BlogTable,
  BlogPagination,
  BlogForm,
  BlogPreview,
  DeleteConfirmModal,
} from "../../components/admin/blog";
import api from "../../services/api";


const ITEMS_PER_PAGE = 5;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await api.getBlogs({ limit: 200 });
        const data = res.data || res.blogs || res || [];
        setBlogs((Array.isArray(data) ? data : []).map((b) => ({
          ...b,
          id: b._id || b.id,
          thumbnail: b.thumbnail || b.image || "",
          author: b.author?.name || b.author || "Admin",
          tags: Array.isArray(b.tags) ? b.tags : [],
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // View states
  const [view, setView] = useState("list"); // 'list', 'create', 'edit'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [deleteBlog, setDeleteBlog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.status === "published").length;
    const draft = blogs.filter((b) => b.status === "draft").length;
    const thisMonth = blogs.filter((b) => {
      const date = new Date(b.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    return { total, published, draft, thisMonth };
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchSearch = blog.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory = !categoryFilter || blog.category === categoryFilter;
      const matchStatus = !statusFilter || blog.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [blogs, searchTerm, categoryFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Handlers
  const handleView = (blog) => {
    setPreviewBlog(blog);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setView("edit");
  };

  const handleDelete = (blog) => {
    setDeleteBlog(blog);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await api.deleteBlog(deleteBlog.id);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteBlog.id));
      setDeleteBlog(null);
    } catch (err) {
      alert(err.message || "Xóa thất bại");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreate = () => {
    setSelectedBlog(null);
    setView("create");
  };

  const handleSubmit = async (data) => {
    try {
      if (view === "edit" && selectedBlog) {
        const res = await api.updateBlog(selectedBlog.id, data);
        const updated = res.data || res;
        setBlogs((prev) =>
          prev.map((b) => b.id === selectedBlog.id ? { ...b, ...updated, id: selectedBlog.id } : b)
        );
        if (data.featured) {
          alert("✅ Bài viết đã được đánh dấu nổi bật. Các bài viết nổi bật khác đã được tự động bỏ đánh dấu.");
        }
      } else {
        const res = await api.createBlog(data);
        const created = res.data || res;
        setBlogs((prev) => [{ ...created, id: created._id || created.id }, ...prev]);
        if (data.featured) {
          alert("✅ Bài viết đã được tạo và đánh dấu nổi bật. Các bài viết nổi bật khác đã được tự động bỏ đánh dấu.");
        }
      }
      setView("list");
      setSelectedBlog(null);
    } catch (err) {
      alert(err.message || "Lưu thất bại");
    }
  };

  const handleCancel = () => {
    setView("list");
    setSelectedBlog(null);
  };

  const handlePreview = (data) => {
    setPreviewBlog(data);
  };

  const hasActiveFilters = categoryFilter || statusFilter;

  const clearAllFilters = () => {
    setCategoryFilter("");
    setStatusFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Render based on view
  if (view === "create" || view === "edit") {
    return (
      <div className="space-y-6">
        <BlogForm
          blog={selectedBlog}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onPreview={handlePreview}
          isEditing={view === "edit"}
        />
        {previewBlog && (
          <BlogPreview blog={previewBlog} onClose={() => setPreviewBlog(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý Blog</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả bài viết trên website</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] transition-colors cursor-pointer"
        >
          <Plus size={20} />
          Tạo bài viết
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Tổng bài viết</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              <p className="text-sm text-gray-500">Đã xuất bản</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
              <p className="text-sm text-gray-500">Bản nháp</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              <p className="text-sm text-gray-500">Tháng này</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(""); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Filter size={16} />
              <span className="text-sm font-medium">Lọc:</span>
            </div>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF385C] cursor-pointer bg-white"
              >
                <option value="">Tất cả danh mục</option>
                <option value="travel-tips">Mẹo du lịch</option>
                <option value="destination">Điểm đến</option>
                <option value="hotel-review">Đánh giá khách sạn</option>
                <option value="food-culture">Ẩm thực & Văn hóa</option>
                <option value="news">Tin tức</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF385C] cursor-pointer bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-[#FF385C] border border-[#FF385C]/30 rounded-lg hover:bg-[#FF385C]/5 transition-colors cursor-pointer"
              >
                <X size={15} />
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap -mt-3">
          <span className="text-sm text-gray-500">Đang lọc:</span>
          {categoryFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
              {categoryFilter === "travel-tips" ? "Mẹo du lịch"
                : categoryFilter === "destination" ? "Điểm đến"
                : categoryFilter === "hotel-review" ? "Đánh giá khách sạn"
                : categoryFilter === "food-culture" ? "Ẩm thực & Văn hóa"
                : "Tin tức"}
              <button
                onClick={() => { setCategoryFilter(""); setCurrentPage(1); }}
                className="p-0.5 hover:bg-[#FF385C]/20 rounded-full cursor-pointer"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FF385C]/10 text-[#FF385C] rounded-full text-sm font-medium">
              {statusFilter === "published" ? "Đã xuất bản" : "Bản nháp"}
              <button
                onClick={() => { setStatusFilter(""); setCurrentPage(1); }}
                className="p-0.5 hover:bg-[#FF385C]/20 rounded-full cursor-pointer"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <BlogTable
        blogs={paginatedBlogs}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Preview Modal */}
      {previewBlog && (
        <BlogPreview blog={previewBlog} onClose={() => setPreviewBlog(null)} />
      )}

      {/* Delete Confirm Modal */}
      {deleteBlog && (
        <DeleteConfirmModal
          blog={deleteBlog}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteBlog(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default BlogManagement;
