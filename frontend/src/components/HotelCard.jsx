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
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
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
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
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
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#FF385C] transition-colors">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 mb-3">
          <MapPin size={14} />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            {amenities.slice(0, 3).map((amenity) => {
              const Icon = amenityIcons[amenity] || Wifi;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md"
                >
                  <Icon size={12} className="text-gray-600" />
                  <span className="text-xs text-gray-600 capitalize">{amenity}</span>
                </div>
              );
            })}
            {amenities.length > 3 && (
              <span className="text-xs text-gray-500">+{amenities.length - 3} tiện ích khác</span>
            )}
          </div>
        )}

        {/* View Detail Button */}
        <Link
          to={`/hotels/${id}`}
          className="block w-full py-2.5 text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors cursor-pointer"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
