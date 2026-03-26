import { useState } from 'react';
import { Search, X } from 'lucide-react';

const BlogSearch = ({ onSearch, placeholder = 'Tìm kiếm bài viết...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`flex items-center bg-white border rounded-xl transition-all duration-200 ${
          isFocused
            ? 'border-[#FF385C] ring-2 ring-[#FF385C]/20'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <Search
          size={20}
          className={`ml-4 transition-colors ${
            isFocused ? 'text-[#FF385C]' : 'text-gray-400'
          }`}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-3 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 mr-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} className="text-gray-400" />
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 mr-1.5 bg-[#FF385C] text-white font-medium rounded-lg hover:bg-[#E31C5F] transition-colors cursor-pointer"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  );
};

export default BlogSearch;
