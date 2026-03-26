import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Hà Nội',
    description: 'Thủ đô ngàn năm văn hiến',
    image: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?q=80&w=800',
    properties: 320,
    featured: true,
  },
  {
    id: 2,
    name: 'Hồ Chí Minh',
    description: 'Thành phố năng động bậc nhất',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800',
    properties: 512,
    featured: false,
  },
  {
    id: 3,
    name: 'Đà Nẵng',
    description: 'Thành phố đáng sống nhất Việt Nam',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=800',
    properties: 218,
    featured: false,
  },
  {
    id: 4,
    name: 'Nha Trang',
    description: 'Thiên đường biển xanh cát trắng',
    image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?q=80&w=800',
    properties: 176,
    featured: false,
  },
  {
    id: 5,
    name: 'Đà Lạt',
    description: 'Thành phố ngàn hoa mộng mơ',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800',
    properties: 143,
    featured: false,
  },
];

const DestinationCard = ({ destination, size = 'normal' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hotels?city=${encodeURIComponent(destination.name)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
    >
      {/* Image */}
      <div
        className={`w-full overflow-hidden ${
          size === 'large'
            ? 'h-[420px]'
            : size === 'medium'
            ? 'h-52'
            : 'h-44'
        }`}
      >
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-[#FF385C]/0 group-hover:bg-[#FF385C]/15 transition-colors duration-300" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-end justify-between">
          <div>
            <h3
              className={`font-bold text-white mb-1 leading-tight ${
                size === 'large' ? 'text-3xl' : 'text-xl'
              }`}
            >
              {destination.name}
            </h3>
            <p className="text-white/75 text-sm mb-2">{destination.description}</p>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <MapPin size={14} />
              <span>{destination.properties.toLocaleString()} khách sạn</span>
            </div>
          </div>

          {/* Arrow Button */}
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#FF385C] transition-colors duration-300 shrink-0 ml-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedDestinations = () => {
  const [featured, ...rest] = destinations;

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-[#FF385C]/10 text-[#FF385C] text-sm font-medium rounded-full mb-4">
            Điểm đến nổi bật
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 font-[Poppins] mb-3">
            Khám phá Việt Nam
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Từ thủ đô lịch sử đến những bãi biển thiên đường — tìm ngay khách sạn tại điểm đến yêu thích của bạn.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured card — spans 2 rows on lg */}
          <div className="lg:row-span-2">
            <DestinationCard destination={featured} size="large" />
          </div>

          {/* 4 smaller cards */}
          {rest.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} size="medium" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
