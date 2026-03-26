import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  Calendar,
  Users,
  CreditCard,
  Banknote,
  Wallet,
  CheckCircle2,
  User,
  Phone,
  Mail,
  ChevronRight,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const PAYMENT_OPTIONS = [
  {
    id: "pay_at_hotel",
    label: "Pay at Hotel",
    description: "Pay when you arrive",
    icon: Banknote,
  },
  {
    id: "credit_card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, JCB",
    icon: CreditCard,
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Pay with your PayPal account",
    icon: Wallet,
  },
];

const PAYMENT_METHOD_MAP = {
  pay_at_hotel: "cash",
  credit_card: "credit_card",
  paypal: "paypal",
};

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-2">
    <label className="block text-base font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon size={18} className="text-gray-400" />
        </div>
      )}
      <input
        {...props}
        className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 bg-white border ${
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]"
        } rounded-xl text-gray-900 placeholder:text-gray-400 focus:placeholder:opacity-0 text-base outline-none transition-all duration-200`}
      />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

const Booking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const hotelId = searchParams.get("hotelId");
  const roomId = searchParams.get("roomId");
  const roomNumberId = searchParams.get("roomNumberId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = Number(searchParams.get("guests") || 2);

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("pay_at_hotel");

  useEffect(() => {
    const invalidHotelId = !hotelId || hotelId === "undefined" || hotelId === "null";
    const invalidRoomId = !roomId || roomId === "undefined" || roomId === "null";

    if (invalidHotelId || invalidRoomId) {
      setDataError("Thiếu thông tin đặt phòng. Vui lòng quay lại và chọn phòng.");
      setLoadingData(false);
      return;
    }

    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [hotelRes, roomRes] = await Promise.all([
          api.getHotel(hotelId),
          api.getRoom(roomId),
        ]);

        const hotelData = hotelRes.data || hotelRes;
        const roomData = roomRes.data || roomRes;

        setHotel({
          ...hotelData,
          id: hotelData._id || hotelData.id,
          image: hotelData.images?.[0] || hotelData.image || "",
          location: hotelData.address || hotelData.location || hotelData.city || "",
        });

        setRoom({
          ...roomData,
          id: roomData._id || roomData.id,
          title: roomData.title || roomData.name || "Room",
          price: roomData.pricePerNight || roomData.price || 0,
          beds: roomData.beds || `${roomData.maxPeople || 2} guests`,
        });
      } catch (err) {
        setDataError(err.message || "Không thể tải thông tin đặt phòng");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [hotelId, roomId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const totalPrice = room ? room.price * nights : 0;

  const validate = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Enter a valid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setFieldErrors({
        _general: "Missing date information. Please go back and pick dates.",
      });
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const bookingPayload = {
        hotelId,
        roomId,
        roomNumberId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        paymentMethod: PAYMENT_METHOD_MAP[paymentMethod] || "cash",
        guestInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        totalPrice,
      };

      const res = await api.createBooking(bookingPayload);
      const booking = res.data || res;

      setBookingResult({
        _id: booking._id || booking.id || `BK-${Date.now()}`,
        hotelName: hotel?.name || "Hotel",
        roomTitle: room?.title || "Room",
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
        paymentMethod,
      });
    } catch (err) {
      setFieldErrors({ _general: err.message || "Đặt phòng thất bại. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-gray-500">Đang tải thông tin...</p>
        </main>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {dataError}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} /> Quay lại
          </button>
        </main>
      </div>
    );
  }

  if (bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-linear-to-br from-[#FF385C] to-[#E31C5F] px-8 py-10 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={44} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Booking Confirmed!
              </h1>
              <p className="text-white/80 text-base mt-2">
                Your reservation has been created successfully
              </p>
            </div>

            <div className="p-7 space-y-5">
              <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Booking ID
                  </span>
                  <span className="text-base font-mono font-semibold text-gray-800">
                    {bookingResult._id}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Hotel</span>
                  <span className="text-base font-medium text-gray-800 text-right max-w-[60%]">
                    {bookingResult.hotelName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Room</span>
                  <span className="text-base font-medium text-gray-800">
                    {bookingResult.roomTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Check-in</span>
                  <span className="text-base font-medium text-gray-800">
                    {formatDate(bookingResult.checkInDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">Check-out</span>
                  <span className="text-base font-medium text-gray-800">
                    {formatDate(bookingResult.checkOutDate)}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-700">
                    Total Paid
                  </span>
                  <span className="text-2xl font-bold text-[#FF385C]">
                    ${bookingResult.totalPrice}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="flex-1 py-3.5 bg-[#FF385C] text-white text-base font-semibold rounded-xl hover:bg-[#E31C5F] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 py-3.5 border border-gray-300 text-gray-700 text-base font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-base text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-7">
          Complete Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {fieldErrors._general && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-base">
                {fieldErrors._general}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF385C]/10 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-[#FF385C]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Guest Information
                  </h2>
                  <p className="text-sm text-gray-500">
                    Enter the primary guest details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  icon={User}
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                  error={fieldErrors.firstName}
                />
                <InputField
                  label="Last Name"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                  error={fieldErrors.lastName}
                />
              </div>

              <InputField
                label="Email Address"
                icon={Mail}
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                error={fieldErrors.email}
              />

              <InputField
                label="Phone Number"
                icon={Phone}
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                error={fieldErrors.phone}
              />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF385C]/10 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} className="text-[#FF385C]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment Method
                  </h2>
                  <p className="text-sm text-gray-500">
                    Choose how you want to pay
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {PAYMENT_OPTIONS.map(
                  ({ id, label, description, icon: Icon }) => {
                    const selected = paymentMethod === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setPaymentMethod(id)}
                        className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer ${
                          selected
                            ? "border-[#FF385C] bg-[#FF385C]/5"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            selected ? "bg-[#FF385C]/10" : "bg-gray-100"
                          }`}
                        >
                          <Icon
                            size={22}
                            className={
                              selected ? "text-[#FF385C]" : "text-gray-500"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-base font-semibold ${selected ? "text-[#FF385C]" : "text-gray-800"}`}
                          >
                            {label}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {description}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selected
                              ? "border-[#FF385C] bg-[#FF385C]"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
              <Shield size={15} className="text-gray-400 shrink-0" />
              <span>Your payment information is encrypted and secure.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4.5 bg-[#FF385C] hover:bg-[#E31C5F] disabled:opacity-60 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.99] cursor-pointer shadow-sm shadow-[#FF385C]/30"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
            {hotel && room && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative h-52 overflow-hidden">
                  {hotel.image ? (
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-white font-semibold text-base leading-tight">
                      {hotel.name}
                    </p>
                    <p className="text-white/80 text-sm mt-1">{hotel.location}</p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Booking Summary
                  </h2>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <BedDouble size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Room Type</p>
                      <p className="text-base font-medium text-gray-800">
                        {room.title}
                      </p>
                      {room.beds && (
                        <p className="text-sm text-gray-400 mt-0.5">{room.beds}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={18} className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Stay Dates</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Check-in</p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">
                            {checkIn
                              ? new Date(checkIn).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-400">Check-out</p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">
                            {checkOut
                              ? new Date(checkOut).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                      <Users size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Guests</p>
                      <p className="text-base font-medium text-gray-800">
                        {guests} {guests === 1 ? "Guest" : "Guests"}
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="space-y-2.5">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">
                        ${room.price} &times; {nights}{" "}
                        {nights === 1 ? "night" : "nights"}
                      </span>
                      <span className="text-gray-700 font-medium">
                        ${room.price * nights}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-500">Taxes & fees</span>
                      <span className="text-green-600 font-medium text-sm">
                        Included
                      </span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-[#FF385C]">
                        ${totalPrice}
                      </span>
                      <p className="text-sm text-gray-400">USD</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#FF385C]/5 border border-[#FF385C]/20 rounded-xl p-5 flex items-start gap-3">
              <CheckCircle2
                size={20}
                className="text-[#FF385C] shrink-0 mt-0.5"
              />
              <div>
                <p className="text-base font-medium text-[#FF385C]">
                  Free Cancellation
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cancel before check-in for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
