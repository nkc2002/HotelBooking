import { Filter, ChevronDown } from 'lucide-react';

const categories = [
  { id: '', label: 'Tất cả danh mục' },
  { id: 'travel-tips', label: 'Mẹo du lịch' },
  { id: 'destination', label: 'Điểm đến' },
  { id: 'hotel-review', label: 'Đánh giá khách sạn' },
  { id: 'food-culture', label: 'Ẩm thực & Văn hóa' },
  { id: 'news', label: 'Tin tức' },
];

const statuses = [
  { id: '', label: 'Tất cả trạng thái' },
  { id: 'published', label: 'Đã xuất bản' },
  { id: 'draft', label: 'Bản nháp' },
];

const BlogFilter = ({ categoryFilter, statusFilter, onCategoryChange, onStatusChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-500">
        <Filter size={18} />
        <span className="text-sm font-medium">Lọc:</span>
      </div>

      {/* Category Filter */}
      <div className="relative">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF385C] cursor-pointer bg-white"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#FF385C] cursor-pointer bg-white"
        >
          {statuses.map((status) => (
            <option key={status.id} value={status.id}>
              {status.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default BlogFilter;
export { categories };
