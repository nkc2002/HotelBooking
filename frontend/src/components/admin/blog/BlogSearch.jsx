import { Search, X } from 'lucide-react';

const BlogSearch = ({ value, onChange, placeholder = 'Tìm kiếm bài viết...' }) => {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default BlogSearch;
