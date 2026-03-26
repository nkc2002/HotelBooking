// Hotel amenities (tiện nghi chung của khách sạn)
const hotelAmenities = [
  { id: 'wifi', name: 'Wifi miễn phí', icon: 'wifi', description: 'Kết nối internet tốc độ cao miễn phí' },
  { id: 'parking', name: 'Bãi đỗ xe', icon: 'car', description: 'Bãi đỗ xe rộng rãi, có bảo vệ 24/7' },
  { id: 'pool', name: 'Hồ bơi', icon: 'waves', description: 'Hồ bơi ngoài trời và trong nhà' },
  { id: 'gym', name: 'Phòng gym', icon: 'dumbbell', description: 'Phòng tập gym đầy đủ thiết bị' },
  { id: 'restaurant', name: 'Nhà hàng', icon: 'utensils', description: 'Nhà hàng phục vụ ẩm thực đa dạng' },
  { id: 'breakfast', name: 'Bữa sáng', icon: 'coffee', description: 'Buffet sáng phong phú' },
  { id: 'spa', name: 'Spa & Wellness', icon: 'sparkles', description: 'Dịch vụ spa và chăm sóc sức khỏe' },
  { id: 'reception24', name: 'Lễ tân 24/7', icon: 'clock', description: 'Lễ tân phục vụ 24 giờ' },
  { id: 'laundry', name: 'Dịch vụ giặt ủi', icon: 'shirt', description: 'Giặt ủi và giặt khô' },
  { id: 'security', name: 'An ninh 24/7', icon: 'shield', description: 'Bảo vệ và camera an ninh' },
  { id: 'meeting', name: 'Phòng họp', icon: 'briefcase', description: 'Phòng họp và hội nghị' },
  { id: 'playground', name: 'Khu vui chơi trẻ em', icon: 'baby', description: 'Khu vực vui chơi an toàn cho trẻ' },
  { id: 'accessible', name: 'Hỗ trợ người khuyết tật', icon: 'accessibility', description: 'Tiện nghi cho người khuyết tật' },
  { id: 'petfriendly', name: 'Cho phép thú cưng', icon: 'pawprint', description: 'Chấp nhận thú cưng' },
];

// Room amenities (tiện nghi riêng của phòng)
const roomAmenities = [
  { id: 'aircon', name: 'Điều hòa', icon: 'wind', description: 'Điều hòa nhiệt độ 2 chiều' },
  { id: 'tv', name: 'TV màn hình phẳng', icon: 'tv', description: 'Smart TV với các kênh truyền hình' },
  { id: 'minibar', name: 'Minibar', icon: 'refrigerator', description: 'Tủ lạnh mini với đồ uống' },
  { id: 'safe', name: 'Két sắt', icon: 'lock', description: 'Két sắt an toàn trong phòng' },
  { id: 'bathtub', name: 'Bồn tắm', icon: 'bath', description: 'Bồn tắm riêng trong phòng' },
  { id: 'shower', name: 'Vòi sen', icon: 'showerhead', description: 'Vòi sen nước nóng lạnh' },
  { id: 'desk', name: 'Bàn làm việc', icon: 'briefcase', description: 'Bàn làm việc với đèn' },
  { id: 'roomwifi', name: 'Wifi phòng', icon: 'wifi', description: 'Wifi tốc độ cao trong phòng' },
  { id: 'seaview', name: 'View biển', icon: 'wavesicon', description: 'Phòng có tầm nhìn ra biển' },
  { id: 'mountainview', name: 'View núi', icon: 'mountain', description: 'Phòng có tầm nhìn ra núi' },
  { id: 'balcony', name: 'Ban công', icon: 'sunset', description: 'Ban công riêng' },
  { id: 'soundproof', name: 'Phòng cách âm', icon: 'volume2', description: 'Cách âm tốt, yên tĩnh' },
  { id: 'heating', name: 'Máy sưởi', icon: 'heater', description: 'Máy sưởi trong phòng' },
  { id: 'kitchen', name: 'Bếp nhỏ', icon: 'utensilscrossed', description: 'Bếp nhỏ với dụng cụ nấu ăn' },
  { id: 'coffeemaker', name: 'Máy pha cà phê', icon: 'coffee', description: 'Máy pha cà phê/trà' },
  { id: 'sofa', name: 'Ghế sofa', icon: 'sofa', description: 'Khu vực tiếp khách với sofa' },
];

// Get hotel amenity by id
const getHotelAmenityById = (id) => {
  return hotelAmenities.find((a) => a.id === id);
};

// Get room amenity by id
const getRoomAmenityById = (id) => {
  return roomAmenities.find((a) => a.id === id);
};

// Validate hotel amenities
const validateHotelAmenities = (amenityIds) => {
  const validIds = hotelAmenities.map((a) => a.id);
  return amenityIds.filter((id) => validIds.includes(id));
};

// Validate room amenities
const validateRoomAmenities = (amenityIds) => {
  const validIds = roomAmenities.map((a) => a.id);
  return amenityIds.filter((id) => validIds.includes(id));
};

module.exports = {
  hotelAmenities,
  roomAmenities,
  getHotelAmenityById,
  getRoomAmenityById,
  validateHotelAmenities,
  validateRoomAmenities,
};
