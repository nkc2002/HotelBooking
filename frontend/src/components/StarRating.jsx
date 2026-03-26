import { useState } from 'react';

const LABELS = {
  1: 'Tệ',
  2: 'Không tốt',
  3: 'Bình thường',
  4: 'Tốt',
  5: 'Xuất sắc',
};

const StarRating = ({ value = 0, onChange, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);

  const sizeMap = {
    sm: { star: 18, gap: 'gap-0.5' },
    md: { star: 28, gap: 'gap-1' },
    lg: { star: 36, gap: 'gap-1.5' },
  };
  const { star: starSize, gap } = sizeMap[size] || sizeMap.md;

  const active = hovered || value;

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className={`flex items-center ${gap}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-transform duration-100 focus:outline-none ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={`${star} sao`}
          >
            <svg
              width={starSize}
              height={starSize}
              viewBox="0 0 24 24"
              fill={star <= active ? '#FF385C' : 'none'}
              stroke={star <= active ? '#FF385C' : '#D1D5DB'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>

      {!readonly && active > 0 && (
        <span className="text-sm font-medium text-[#FF385C]">{LABELS[active]}</span>
      )}
    </div>
  );
};

export default StarRating;
