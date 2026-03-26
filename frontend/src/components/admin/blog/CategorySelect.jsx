import { ChevronDown, Tag } from 'lucide-react';

const categories = [
  { id: 'travel-tips', label: 'Mẹo du lịch', color: 'bg-blue-500' },
  { id: 'destination', label: 'Điểm đến', color: 'bg-emerald-500' },
  { id: 'hotel-review', label: 'Đánh giá khách sạn', color: 'bg-amber-500' },
  { id: 'food-culture', label: 'Ẩm thực & Văn hóa', color: 'bg-purple-500' },
  { id: 'news', label: 'Tin tức', color: 'bg-rose-500' },
];

const CategorySelect = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Danh mục <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Tag
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-10 py-3 border rounded-xl outline-none appearance-none bg-white cursor-pointer transition-colors ${
            error
              ? 'border-red-300 focus:border-red-500'
              : 'border-gray-200 focus:border-[#FF385C]'
          }`}
        >
          <option value="">Chọn danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {/* Category Preview */}
      {value && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">Đã chọn:</span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white rounded-full ${
              categories.find((c) => c.id === value)?.color || 'bg-gray-500'
            }`}
          >
            {categories.find((c) => c.id === value)?.label}
          </span>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
export { categories };
