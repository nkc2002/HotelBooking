import { Users, X } from "lucide-react";
import { formatVnd } from "../utils/currency";

const RoomCard = ({ room, onBook, isSelected }) => {
  const {
    title,
    description,
    image,
    capacity,
    price,
    originalPrice,
    totalRooms,
    availableRooms,
    amenities,
  } = room;
  const isAvailable = availableRooms > 0;

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 p-4 border-2 rounded-2xl transition-colors ${
        isSelected ? "border-[#FF385C] bg-[#FF385C]/5" : "border-gray-200"
      } ${!isAvailable ? "opacity-60" : ""}`}
    >
      {/* Room Image */}
      <div className="md:w-72 shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-48 md:h-full object-cover rounded-xl"
        />
      </div>

      {/* Room Info */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isAvailable ? `Còn ${availableRooms} phòng` : "Hết phòng"}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{description}</p>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Users size={16} />
            <span>Tối đa {capacity} khách</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Booking */}
        <div className="flex items-end justify-between pt-4 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatVnd(price)}
              </span>
              <span className="text-gray-500">/đêm</span>
            </div>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatVnd(originalPrice)}
              </span>
            )}
          </div>

          {isAvailable ? (
            <button
              onClick={() => onBook?.(room)}
              className={`px-6 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${
                isSelected
                  ? "bg-gray-900 hover:bg-gray-800 text-white"
                  : "bg-[#FF385C] hover:bg-[#E31C5F] text-white"
              }`}
            >
              {isSelected ? "Đã chọn" : "Chọn phòng"}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <X size={16} />
              <span className="text-sm font-medium">Hết phòng</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RoomList = ({ hotelRooms, onBookRoom, selectedRoom }) => {
  const displayRooms = Array.isArray(hotelRooms) ? hotelRooms : [];

  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Các loại phòng
      </h2>
      <p className="text-gray-500 mb-6">
        Chọn phòng phù hợp với bạn, sau đó điền thông tin đặt phòng bên phải
      </p>
      {displayRooms.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-gray-500">
          Khách sạn hiện chưa có phòng khả dụng.
        </div>
      ) : (
        <div className="space-y-4">
          {displayRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBook={onBookRoom}
              isSelected={selectedRoom?.id === room.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
