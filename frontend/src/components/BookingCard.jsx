import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';

const BookingCard = ({ hotel, selectedRoom }) => {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  const basePrice = selectedRoom?.price || 250;
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 1;
  const serviceFee = Math.round(basePrice * nights * 0.12);
  const totalPrice = basePrice * nights + serviceFee;

  const handleReserve = () => {
    const resolvedHotelId = hotel?.id || hotel?._id || "";
    const resolvedRoomId = selectedRoom?.id || selectedRoom?._id || "";
    const resolvedRoomNumberId = selectedRoom?.roomNumberId || "";

    if (!resolvedHotelId || !resolvedRoomId) {
      alert("Thiếu thông tin khách sạn/phòng. Vui lòng chọn lại phòng.");
      return;
    }

    navigate(
      `/booking?hotelId=${encodeURIComponent(resolvedHotelId)}&roomId=${encodeURIComponent(
        resolvedRoomId
      )}&roomNumberId=${encodeURIComponent(
        resolvedRoomNumberId
      )}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(
        checkOut
      )}&guests=${encodeURIComponent(guests)}`
    );
  };

  return (
    <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
      {/* Price Header */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-2xl font-semibold">${basePrice}</span>
        <span className="text-gray-500">night</span>
        {hotel?.rating && (
          <div className="ml-auto flex items-center gap-1 text-sm">
            <Star size={14} className="text-[#FF385C] fill-[#FF385C]" />
            <span className="font-medium">{hotel.rating}</span>
            <span className="text-gray-500">({hotel.reviews})</span>
          </div>
        )}
      </div>

      {/* Date & Guest Picker */}
      <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
        {/* Dates */}
        <div className="grid grid-cols-2 border-b border-gray-300">
          <div className="p-3 border-r border-gray-300">
            <label className="block text-xs font-semibold text-gray-800 uppercase mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-sm outline-none cursor-pointer"
            />
          </div>
          <div className="p-3">
            <label className="block text-xs font-semibold text-gray-800 uppercase mb-1">
              Checkout
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-sm outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <button
            onClick={() => setShowGuestPicker(!showGuestPicker)}
            className="w-full p-3 text-left flex items-center justify-between cursor-pointer"
          >
            <div>
              <label className="block text-xs font-semibold text-gray-800 uppercase mb-1">
                Guests
              </label>
              <span className="text-sm">{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
            {showGuestPicker ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {/* Guest Picker Dropdown */}
          {showGuestPicker && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Guests</p>
                  <p className="text-sm text-gray-500">Max 6 guests</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={guests <= 1}
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{guests}</span>
                  <button
                    onClick={() => setGuests(Math.min(6, guests + 1))}
                    className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={guests >= 6}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        className="w-full py-3 bg-linear-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
      >
        Reserve
      </button>

      <p className="text-center text-sm text-gray-500 mt-3">
        You won't be charged yet
      </p>

      {/* Price Breakdown */}
      {checkIn && checkOut && nights > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex justify-between text-gray-700">
            <span className="underline">${basePrice} x {nights} night{nights > 1 ? 's' : ''}</span>
            <span>${basePrice * nights}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="underline">Service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between font-semibold pt-3 border-t border-gray-200">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;

