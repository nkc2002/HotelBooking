import { FileText } from 'lucide-react';
import BlogRow from './BlogRow';

const BlogTable = ({ blogs, loading, onView, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-10 h-10 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có bài viết nào
          </h3>
          <p className="text-gray-500">
            Chưa có bài viết nào phù hợp với bộ lọc của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                Bài viết
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                Danh mục
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                Tác giả
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                Ngày tạo
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                Trạng thái
              </th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <BlogRow
                key={blog.id}
                blog={blog}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogTable;
