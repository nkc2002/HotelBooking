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
          rating: hotelData.rating || hotelData.averageRating || 0,
          reviews: hotelData.numReviews || hotelData.reviews || 0,
          amenities: hotelData.amenities || [],
          address: hotelData.address || hotelData.location || "",
        };

        const normalizedRooms = (Array.isArray(roomsData) ? roomsData : []).map((room) => ({
          ...room,
          id: room._id || room.id,
          roomNumberId: room._id || room.id,
          title: room.title || room.name || "Room",
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
            Where you'll be
          </h2>
          <p className="text-gray-700 mb-4">{hotel.address}</p>
          <div className="h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg
                className="w-16 h-16 mx-auto mb-2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p>Map will be displayed here</p>
              <p className="text-sm">Integration with Google Maps or Mapbox</p>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Things to know
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">House rules</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Check-in: After 3:00 PM</li>
                <li>Checkout: 11:00 AM</li>
                <li>No smoking</li>
                <li>No pets allowed</li>
                <li>No parties or events</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Safety & property
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Pool/hot tub without a gate</li>
                <li>Nearby lake, river, or water</li>
                <li>Carbon monoxide alarm</li>
                <li>Smoke alarm</li>
                <li>Security cameras on property</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">
                Cancellation policy
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>Free cancellation for 48 hours</li>
                <li>Review the host's full policy</li>
                <li>for details and exceptions</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HotelDetail;
