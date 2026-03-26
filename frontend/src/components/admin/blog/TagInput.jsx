import { useState } from 'react';
import { X, Plus, Hash } from 'lucide-react';

const TagInput = ({ value = [], onChange, maxTags = 10 }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInputValue('');
    }
  };

  const removeTag = (index) => {
    const newTags = value.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const suggestedTags = [
    'du lịch',
    'khách sạn',
    'resort',
    'biển',
    'núi',
    'ẩm thực',
    'văn hóa',
    'mẹo hay',
    'tiết kiệm',
    'luxury',
  ].filter((tag) => !value.includes(tag));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tags
      </label>

      {/* Tags Container */}
      <div className="border border-gray-200 rounded-xl p-3 focus-within:border-[#FF385C] transition-colors">
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FF385C]/10 text-[#FF385C] text-sm rounded-lg"
            >
              <Hash size={14} />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 hover:text-red-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Input */}
        {value.length < maxTags && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tag và nhấn Enter..."
              className="flex-1 outline-none text-sm"
            />
            {inputValue && (
              <button
                type="button"
                onClick={addTag}
                className="p-1.5 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] cursor-pointer"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mt-1 text-xs text-gray-400">
        {value.length}/{maxTags} tags (nhấn Enter hoặc dấu phẩy để thêm)
      </p>

      {/* Suggested Tags */}
      {suggestedTags.length > 0 && value.length < maxTags && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Gợi ý:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onChange([...value, tag])}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagInput;
