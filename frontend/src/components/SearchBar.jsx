import { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

const SearchBar = ({ onSearch, initialValues = {} }) => {
  const today = new Date().toISOString().split('T')[0];
  const [searchData, setSearchData] = useState({
    location: initialValues.location || '',
    checkIn: initialValues.checkIn || '',
    checkOut: initialValues.checkOut || '',
    guests: initialValues.guests || 1,
  });

  useEffect(() => {
    if (initialValues.location !== undefined) {
      setSearchData((prev) => ({
        ...prev,
        location: initialValues.location || '',
        checkIn: initialValues.checkIn || prev.checkIn,
        checkOut: initialValues.checkOut || prev.checkOut,
        guests: initialValues.guests || prev.guests,
      }));
    }
  }, [initialValues.location]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Location */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Địa điểm
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Bạn muốn đi đâu?"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Check-in */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nhận phòng
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                        ? ''
                        : prev.checkOut,
                  }))
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Trả phòng
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={searchData.checkOut}
                min={searchData.checkIn || today}
                onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Guests & Search Button */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Số khách
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF385C] focus:border-transparent outline-none transition-all text-sm appearance-none cursor-pointer bg-white"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#FF385C] hover:bg-[#E31C5F] text-white rounded-xl transition-colors cursor-pointer"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
