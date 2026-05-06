import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ImageGallery from "../components/ImageGallery";
import HotelInfo from "../components/HotelInfo";
import RoomList from "../components/RoomList";
import ReviewSection from "../components/ReviewSection";
import BookingCard from "../components/BookingCard";
import api from "../services/api";

const HotelDetail = () => {
  const { id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookingCardRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          api.getHotel(id),
          api.getHotelRooms(id),
        ]);

        const hotelData = hotelRes.data || hotelRes;
        const roomsData = roomsRes.data || roomsRes.rooms || roomsRes || [];

        const normalizedHotel = {
          ...hotelData,
          id: hotelData._id || hotelData.id,
          images: hotelData.images || (hotelData.image ? [hotelData.image] : []),
          price: hotelData.pricePerNight || hotelData.price || 0,
          rating:
            hotelData.averageRating ??
            hotelData.rating ??
            0,
          reviews:
            hotelData.numReviews ??
            hotelData.totalReviews ??
            (Array.isArray(hotelData.reviews) ? hotelData.reviews.length : hotelData.reviews) ??
            0,
          amenities: hotelData.amenities || [],
          address: hotelData.address || hotelData.location || "",
        };

        const normalizedRooms = (Array.isArray(roomsData) ? roomsData : []).map((room) => ({
          ...room,
          id: room._id || room.id,
          roomNumberId: room._id || room.id,
          title: room.title || room.name || "Phòng",
          image: room.images?.[0] || room.image || "",
          price: room.pricePerNight || room.price || 0,
          capacity: room.maxPeople || room.capacity || 2,
          available: room.availableRooms > 0 || room.available !== false,
          amenities: room.amenities || [],
        }));

        setHotel(normalizedHotel);
        setRooms(normalizedRooms);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin khách sạn");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-gray-500">Đang tải thông tin khách sạn...</p>
        </main>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-red-600">{error || "Không tìm thấy khách sạn."}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ImageGallery images={hotel.images} />

        <div className="mt-8 flex flex-col lg:flex-row gap-12">
          <div className="flex-1 lg:max-w-2xl">
            <HotelInfo hotel={hotel} />
            <RoomList
              hotelRooms={rooms}
              onBookRoom={handleBookRoom}
              selectedRoom={selectedRoom}
            />
            <ReviewSection
              hotelId={hotel.id}
              hotelName={hotel.name}
            />
          </div>

          <div className="lg:w-96" ref={bookingCardRef}>
            <BookingCard hotel={hotel} selectedRoom={selectedRoom} />
          </div>
        </div>

        <div className="py-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Vị trí của bạn
          </h2>
          <p className="text-gray-700 mb-4">
            {[hotel.address, hotel.city].filter(Boolean).join(", ")}
          </p>
          <div className="h-96 rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              title="Vị trí khách sạn"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                [hotel.address, hotel.city].filter(Boolean).join(", ")
              )}&output=embed&z=15`}
            />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default HotelDetail;
