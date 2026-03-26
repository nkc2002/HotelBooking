import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, MapPin } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import api from "../services/api";

const HotelCard = ({ hotel }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(hotel.id);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(hotel);
  };

  return (
    <Link to={`/hotels/${hotel.id}`} className="group cursor-pointer block">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
        {hotel.image ? (
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <button
          onClick={handleSaveClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isSaved
                ? "text-[#FF385C] fill-[#FF385C]"
                : "text-gray-700 hover:text-[#FF385C]"
            }`}
          />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
          <span className="text-sm font-semibold text-gray-800">
            ${hotel.price}/đêm
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-[#FF385C] transition-colors line-clamp-1">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-[#FF385C] fill-[#FF385C]" />
            <span className="text-sm font-medium">{hotel.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <MapPin size={14} />
          <span className="text-sm">{hotel.location}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{hotel.reviews} đánh giá</p>
      </div>
    </Link>
  );
};

const PopularHotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    api.getHotels({ limit: 4, sort: "-rating" })
      .then((res) => {
        const data = res.data || res.hotels || res || [];
        const normalized = (Array.isArray(data) ? data : []).slice(0, 4).map((h) => ({
          ...h,
          id: h._id || h.id,
          image: h.images?.[0] || h.image || "",
          price: h.pricePerNight || h.price || 0,
          rating: h.rating || h.averageRating || 0,
          reviews: h.numReviews || h.reviews || 0,
          location: h.city || h.location || "",
        }));
        setHotels(normalized);
      })
      .catch(() => setHotels([]));
  }, []);

  if (hotels.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-[Poppins] mb-2">
              Khách sạn phổ biến
            </h2>
            <p className="text-gray-600">
              Khám phá những điểm đến được yêu thích nhất bởi du khách
            </p>
          </div>
          <Link
            to="/hotels"
            className="hidden md:block px-6 py-2 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/hotels"
            className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-full font-medium hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
          >
            Xem tất cả khách sạn
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularHotels;
