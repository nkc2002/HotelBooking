import { X, Calendar, User, Tag, Hash, Clock } from 'lucide-react';
import DOMPurify from 'dompurify';

const BlogPreview = ({ blog, onClose }) => {
  const getCategoryLabel = (category) => {
    const categories = {
      'travel-tips': 'Mẹo du lịch',
      'destination': 'Điểm đến',
      'hotel-review': 'Đánh giá khách sạn',
      'food-culture': 'Ẩm thực & Văn hóa',
      'news': 'Tin tức',
    };
    return categories[category] || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} phút đọc`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
              Xem trước
            </span>
            {blog.status === 'draft' && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                Bản nháp
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Image */}
          {blog.thumbnail ? (
            <div className="relative h-64 md:h-80">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                {blog.category && (
                  <span className="inline-block px-3 py-1 bg-[#FF385C] text-white text-sm font-medium rounded-full mb-3">
                    {getCategoryLabel(blog.category)}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {blog.title || 'Chưa có tiêu đề'}
                </h1>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-100">
              {blog.category && (
                <span className="inline-block px-3 py-1 bg-[#FF385C] text-white text-sm font-medium rounded-full mb-3">
                  {getCategoryLabel(blog.category)}
                </span>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {blog.title || 'Chưa có tiêu đề'}
              </h1>
            </div>
          )}

          {/* Meta Info */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <User size={16} />
                <span>{blog.author || 'Admin'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>{estimateReadTime(blog.content)}</span>
              </div>
            </div>
          </div>

          {/* Short Description */}
          {blog.shortDescription && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <p className="text-gray-600 italic">{blog.shortDescription}</p>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {blog.content ? (
              <div className="prose prose-gray max-w-none">
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
                />
              </div>
            ) : (
              <p className="text-gray-400 italic">Chưa có nội dung...</p>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={16} className="text-gray-400" />
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                  >
                    <Hash size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-center text-sm text-gray-500">
            Đây là bản xem trước. Bài viết sẽ hiển thị tương tự trên trang blog.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPreview;
