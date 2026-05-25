import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, Wifi, Car, Waves } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
};

const HotelCard = ({ hotel }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(hotel.id);

  const {
    id,
    name,
    location,
    image,
    rating,
    reviews,
    amenities = [],
  } = hotel;
  const hasReviews = Number(reviews) > 0;

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(hotel);
  };

  return (
    <div className="group flex h-full flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button 
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors cursor-pointer"
          onClick={handleSaveClick}
          aria-label={isSaved ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart 
            size={18} 
            className={`transition-colors ${isSaved ? 'text-[#FF385C] fill-[#FF385C]' : 'text-gray-600 hover:text-[#FF385C]'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating */}
        <div className="flex min-h-[22px] items-center gap-1 mb-2">
          {hasReviews ? (
            <>
              <Star size={16} className="text-[#FF385C] fill-[#FF385C]" />
              <span className="text-sm font-semibold text-gray-900">{rating}</span>
              <span className="text-sm text-gray-500">({reviews} đánh giá)</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Chưa có đánh giá</span>
          )}
        </div>

        {/* Name */}
        <h3 className="min-h-[28px] text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#FF385C] transition-colors">
          {name}
        </h3>

        {/* Location */}
        <div className="flex min-h-[22px] items-center gap-1 text-gray-500 mb-3">
          <MapPin size={14} className="shrink-0" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        {/* Amenities */}
        <div className="mb-4 min-h-[70px]">
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <div
                    key={amenity}
                    className="inline-flex max-w-full items-center gap-1 rounded-md bg-gray-100 px-2 py-1"
                  >
                    <Icon size={12} className="shrink-0 text-gray-600" />
                    <span className="truncate text-xs text-gray-600 capitalize">{amenity}</span>
                  </div>
                );
              })}
              {amenities.length > 3 && (
                <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{amenities.length - 3} khác
                </span>
              )}
            </div>
          )}
        </div>

        {/* View Detail Button */}
        <Link
          to={`/hotels/${id}`}
          className="mt-auto block w-full py-2.5 text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
