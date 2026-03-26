import { useState } from "react";
import {
  Star,
  MapPin,
  Share,
  Heart,
  Wifi,
  Car,
  Waves,
  Dumbbell,
  Utensils,
  Wind,
  Coffee,
  Dog,
  Check,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

const amenityIcons = {
  wifi: { icon: Wifi, label: "Free WiFi" },
  parking: { icon: Car, label: "Free Parking" },
  pool: { icon: Waves, label: "Swimming Pool" },
  gym: { icon: Dumbbell, label: "Fitness Center" },
  restaurant: { icon: Utensils, label: "Restaurant" },
  spa: { icon: Wind, label: "Spa & Wellness" },
  breakfast: { icon: Coffee, label: "Breakfast Included" },
  pet: { icon: Dog, label: "Pet Friendly" },
};

const HotelInfo = ({ hotel }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [showShareToast, setShowShareToast] = useState(false);

  const isSaved = hotel?.id ? isInWishlist(hotel.id) : false;

  const handleShare = async () => {
    const shareData = {
      title: hotel?.name || "Grand Luxury Resort & Spa",
      text: `Check out this amazing hotel: ${hotel?.name || "Grand Luxury Resort & Spa"}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  const handleSave = () => {
    if (hotel) {
      toggleWishlist({
        id: hotel.id,
        name: hotel.name,
        location: hotel.address,
        image: hotel.images?.[0] || hotel.image,
        price: hotel.price,
        rating: hotel.rating,
        reviews: hotel.reviews,
      });
    }
  };
  const {
    name = "Grand Luxury Resort & Spa",
    rating = 4.9,
    reviews = 324,
    address = "123 Paradise Beach Road, Bali, Indonesia",
    description = "Experience luxury at its finest in our beachfront resort. Nestled along pristine white sand beaches, our resort offers world-class amenities, exceptional dining, and unforgettable experiences. Whether you are seeking relaxation or adventure, we have everything you need for the perfect getaway.",
    amenities = [
      "wifi",
      "pool",
      "spa",
      "parking",
      "restaurant",
      "gym",
      "breakfast",
    ],
  } = hotel || {};

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            {name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-[#FF385C] fill-[#FF385C]" />
              <span className="font-semibold">{rating}</span>
              <span className="text-gray-500">({reviews} reviews)</span>
            </div>
            <span className="text-gray-300">·</span>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin size={16} />
              <span>{address}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Share size={18} />
            <span className="underline">Share</span>
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer ${isSaved ? "text-[#FF385C]" : ""}`}
          >
            <Heart size={18} className={isSaved ? "fill-[#FF385C]" : ""} />
            <span className="underline">{isSaved ? "Saved" : "Save"}</span>
          </button>
          {showShareToast && (
            <div className="absolute top-full right-0 mt-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg flex items-center gap-2">
              <Check size={16} />
              Link copied!
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="py-6 border-b border-gray-200">
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Amenities */}
      <div className="py-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          What this place offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {amenities.map((amenity) => {
            const item = amenityIcons[amenity];
            if (!item) return null;
            const Icon = item.icon;
            return (
              <div key={amenity} className="flex items-center gap-4">
                <Icon size={24} className="text-gray-700" />
                <span className="text-gray-700">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HotelInfo;
