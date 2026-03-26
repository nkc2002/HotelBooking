import { ArrowRight, Building2, TrendingUp, Users, Shield } from "lucide-react";

const PartnerHero = ({ onRegisterClick }) => {
  const stats = [
    { icon: Building2, value: "2,500+", label: "Khách sạn đối tác" },
    { icon: Users, value: "1M+", label: "Khách hàng mỗi tháng" },
    { icon: TrendingUp, value: "35%", label: "Tăng trưởng đặt phòng" },
    { icon: Shield, value: "99.9%", label: "Thanh toán an toàn" },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920"
          alt="Luxury hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/60" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-[#FF385C]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Đang mở đăng ký đối tác mới
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Hợp tác cùng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF385C] to-[#FF6B6B]">
              HotelBooking
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Phát triển doanh thu khách sạn của bạn với nền tảng đặt phòng hàng
            đầu Việt Nam. Tiếp cận hàng triệu khách hàng tiềm năng mỗi tháng.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button
              onClick={onRegisterClick}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF385C] text-white font-semibold text-lg rounded-xl hover:bg-[#E31C5F] transition-all hover:shadow-lg hover:shadow-[#FF385C]/30 cursor-pointer group"
            >
              Đăng ký ngay
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg rounded-xl hover:bg-white/20 transition-all cursor-pointer"
            >
              Tìm hiểu thêm
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors"
                >
                  <Icon size={28} className="text-[#FF385C] mx-auto mb-3" />
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerHero;
