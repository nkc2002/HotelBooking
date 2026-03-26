import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Văn Minh',
    role: 'Giám đốc',
    hotel: 'Mường Thanh Grand Đà Nẵng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
    rating: 5,
    content:
      'Kể từ khi hợp tác với HotelBooking, lượng đặt phòng của chúng tôi đã tăng 40%. Hệ thống quản lý rất dễ sử dụng và đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ.',
    stats: { bookings: '+40%', revenue: '+35%' },
  },
  {
    id: 2,
    name: 'Trần Thị Hương',
    role: 'Chủ sở hữu',
    hotel: 'Seaside Boutique Hotel Nha Trang',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
    rating: 5,
    content:
      'Là một khách sạn nhỏ, chúng tôi lo ngại về việc cạnh tranh với các chuỗi lớn. Nhưng HotelBooking đã giúp chúng tôi tiếp cận đúng đối tượng khách hàng.',
    stats: { bookings: '+55%', revenue: '+48%' },
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    role: 'Quản lý',
    hotel: 'Vinpearl Resort Phú Quốc',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100',
    rating: 5,
    content:
      'Báo cáo phân tích chi tiết giúp chúng tôi hiểu rõ hơn về hành vi khách hàng và tối ưu hóa chiến lược giá. Doanh thu đã tăng đáng kể.',
    stats: { bookings: '+30%', revenue: '+42%' },
  },
  {
    id: 4,
    name: 'Phạm Thị Mai',
    role: 'Giám đốc điều hành',
    hotel: 'La Siesta Premium Hội An',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100',
    rating: 5,
    content:
      'Quy trình thanh toán minh bạch và nhanh chóng. Chúng tôi luôn nhận được tiền đúng hạn và báo cáo tài chính rõ ràng.',
    stats: { bookings: '+45%', revenue: '+38%' },
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-600 text-sm font-medium rounded-full mb-4">
            Đối tác nói gì
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Được tin tưởng bởi hàng nghìn khách sạn
          </h2>
          <p className="text-lg text-gray-600">
            Nghe những chia sẻ từ các đối tác đã thành công cùng HotelBooking.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Main Testimonial */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left - Content */}
              <div>
                <Quote size={48} className="text-[#FF385C]/20 mb-6" />
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-[#FF385C] text-sm font-medium">
                      {testimonials[currentIndex].hotel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right - Stats */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-6">
                  Kết quả sau khi hợp tác
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-3xl font-bold text-green-600 mb-1">
                      {testimonials[currentIndex].stats.bookings}
                    </p>
                    <p className="text-sm text-gray-600">Lượng đặt phòng</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-3xl font-bold text-blue-600 mb-1">
                      {testimonials[currentIndex].stats.revenue}
                    </p>
                    <p className="text-sm text-gray-600">Doanh thu</p>
                  </div>
                </div>

                {/* Hotel Image */}
                <div className="mt-6 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400"
                    alt="Hotel"
                    className="w-full h-32 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    index === currentIndex
                      ? 'bg-[#FF385C] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronRight size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <p className="text-center text-gray-500 mb-8">
            Được tin tưởng bởi các thương hiệu hàng đầu
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
            {['Mường Thanh', 'Vinpearl', 'Fusion', 'La Siesta', 'Silk Path'].map(
              (brand) => (
                <div
                  key={brand}
                  className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {brand}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
