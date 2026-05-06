import { Link } from 'react-router-dom';
import { Heart, Trash2, Star, MapPin, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const getHotelId = (hotel) => hotel?.id || hotel?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="text-[#FF385C] fill-[#FF385C]" size={28} />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Danh sách yêu thích
              </h1>
            </div>
            <p className="text-gray-500">
              {wishlist.length > 0
                ? `Bạn có ${wishlist.length} khách sạn đã lưu`
                : 'Chưa có khách sạn nào được lưu'}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa tất cả khách sạn đã lưu?')) {
                  clearWishlist();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={18} />
              <span>Xóa tất cả</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart size={40} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có khách sạn yêu thích
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Hãy khám phá và lưu những khách sạn bạn yêu thích bằng cách nhấn vào biểu tượng trái tim
            </p>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF385C] text-white font-medium rounded-xl hover:bg-[#E31C5F] transition-colors"
            >
              <ArrowLeft size={18} />
              Khám phá khách sạn
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((hotel) => (
              <div
                key={getHotelId(hotel)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(getHotelId(hotel))}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors cursor-pointer group"
                    title="Xóa khỏi yêu thích"
                  >
                    <Heart
                      size={18}
                      className="text-[#FF385C] fill-[#FF385C] group-hover:scale-110 transition-transform"
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={16} className="text-[#FF385C] fill-[#FF385C]" />
                    <span className="text-sm font-semibold text-gray-900">
                      {hotel.rating}
                    </span>
                    {hotel.reviews && (
                      <span className="text-sm text-gray-500">
                        ({hotel.reviews} đánh giá)
                      </span>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {hotel.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-gray-500 mb-4">
                    <MapPin size={14} />
                    <span className="text-sm line-clamp-1">
                      {hotel.location || hotel.city}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/hotels/${getHotelId(hotel)}`}
                      className="flex-1 py-2.5 text-center bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(getHotelId(hotel))}
                      className="p-2.5 border border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-xl transition-colors cursor-pointer group"
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash2
                        size={18}
                        className="text-gray-400 group-hover:text-red-500 transition-colors"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Hotels */}
        {wishlist.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 text-[#FF385C] hover:underline font-medium"
            >
              <ArrowLeft size={18} />
              Tiếp tục khám phá khách sạn
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;

