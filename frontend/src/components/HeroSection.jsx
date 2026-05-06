import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.location) params.set('location', searchData.location);
    if (searchData.checkIn) params.set('checkIn', searchData.checkIn);
    if (searchData.checkOut) params.set('checkOut', searchData.checkOut);
    if (searchData.guests) params.set('guests', searchData.guests.toString());
    
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070"
          alt="Khách sạn cao cấp"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-[Poppins] leading-tight">
            Tìm kiếm
            <span className="text-[#FF385C]"> kỳ nghỉ hoàn hảo</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Khám phá những khách sạn tuyệt vời và trải nghiệm độc đáo trên khắp thế giới. 
            Đặt phòng cho chuyến đi mơ ước của bạn ngay hôm nay.
          </p>
        </div>

        {/* Search Form */}
        <div className="mt-8 lg:mt-12">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-4 lg:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Địa điểm
                </label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Bạn muốn đi đâu?"
                    value={searchData.location}
                    onChange={(e) =>
                      setSearchData({ ...searchData, location: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Check-in */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Nhận phòng
                </label>
                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    value={searchData.checkIn}
                    min={today}
                    onChange={(e) =>
                      setSearchData((prev) => ({
                        ...prev,
                        checkIn: e.target.value,
                        checkOut:
                          prev.checkOut && e.target.value && prev.checkOut <= e.target.value
                            ? ""
                            : prev.checkOut,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Check-out */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Trả phòng
                </label>
                <div className="relative">
                  <Calendar
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="date"
                    value={searchData.checkOut}
                    min={searchData.checkIn || today}
                    onChange={(e) =>
                      setSearchData({ ...searchData, checkOut: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Số khách
                </label>
                <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <Users
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      value={searchData.guests}
                      onChange={(e) =>
                        setSearchData({ ...searchData, guests: parseInt(e.target.value) })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all appearance-none cursor-pointer bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} khách
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-[#FF385C] hover:bg-[#E31C5F] text-white px-6 py-3 rounded-xl font-semibold transition-colors cursor-pointer"
                  >
                    <Search size={20} />
                    <span className="hidden lg:inline">Tìm kiếm</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg">
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-white">500+</p>
            <p className="text-sm text-gray-300">Khách sạn</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-white">100+</p>
            <p className="text-sm text-gray-300">Điểm đến</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-bold text-white">50K+</p>
            <p className="text-sm text-gray-300">Khách hài lòng</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
