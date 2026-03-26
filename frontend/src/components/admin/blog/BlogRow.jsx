import { Eye, Edit2, Trash2, Calendar, User, Sparkles } from "lucide-react";

const BlogRow = ({ blog, onView, onEdit, onDelete }) => {
  const getCategoryLabel = (category) => {
    const categories = {
      "travel-tips": "Mẹo du lịch",
      destination: "Điểm đến",
      "hotel-review": "Đánh giá khách sạn",
      "food-culture": "Ẩm thực & Văn hóa",
      news: "Tin tức",
    };
    return categories[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "travel-tips": "bg-blue-100 text-blue-700",
      destination: "bg-emerald-100 text-emerald-700",
      "hotel-review": "bg-amber-100 text-amber-700",
      "food-culture": "bg-purple-100 text-purple-700",
      news: "bg-rose-100 text-rose-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Thumbnail & Title */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-16 h-12 object-cover rounded-lg shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900 truncate max-w-xs">
                {blog.title}
              </h4>
              {blog.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full shrink-0">
                  <Sparkles size={12} />
                  Nổi bật
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate max-w-xs">
              {blog.shortDescription}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4 px-4">
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
            blog.category,
          )}`}
        >
          {getCategoryLabel(blog.category)}
        </span>
      </td>

      {/* Author */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-gray-600">
          <User size={16} />
          <span className="text-sm">{blog.author}</span>
        </div>
      </td>

      {/* Date */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={16} />
          <span className="text-sm">{formatDate(blog.createdAt)}</span>
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        {blog.status === "published" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Đã xuất bản
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
            Bản nháp
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(blog)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Xem"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onEdit(blog)}
            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
            title="Sửa"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(blog)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BlogRow;
