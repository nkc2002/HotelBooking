import {
  TrendingUp,
  Globe,
  LayoutDashboard,
  CreditCard,
  Headphones,
  BarChart3,
  Zap,
  Shield,
} from 'lucide-react';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Tăng lượng đặt phòng',
    description:
      'Tiếp cận hàng triệu khách hàng đang tìm kiếm khách sạn mỗi ngày trên nền tảng của chúng tôi.',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
  },
  {
    icon: Globe,
    title: 'Tiếp cận toàn cầu',
    description:
      'Khách sạn của bạn sẽ được hiển thị cho khách du lịch trong nước và quốc tế.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: LayoutDashboard,
    title: 'Quản lý dễ dàng',
    description:
      'Dashboard trực quan giúp bạn quản lý phòng, giá cả và đặt phòng một cách hiệu quả.',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
  },
  {
    icon: CreditCard,
    title: 'Thanh toán an toàn',
    description:
      'Hệ thống thanh toán bảo mật, chuyển khoản tự động và báo cáo tài chính chi tiết.',
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description:
      'Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giải đáp mọi thắc mắc của bạn bất cứ lúc nào.',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
  },
  {
    icon: BarChart3,
    title: 'Phân tích chi tiết',
    description:
      'Báo cáo và thống kê giúp bạn hiểu rõ hiệu suất kinh doanh và tối ưu hóa doanh thu.',
    color: 'from-sky-500 to-blue-500',
    bgColor: 'bg-sky-50',
  },
  {
    icon: Zap,
    title: 'Cập nhật tức thì',
    description:
      'Thay đổi giá, tình trạng phòng được cập nhật ngay lập tức trên tất cả các kênh.',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50',
  },
  {
    icon: Shield,
    title: 'Bảo vệ đối tác',
    description:
      'Chính sách bảo vệ đối tác với các điều khoản minh bạch và công bằng.',
    color: 'from-teal-500 to-emerald-500',
    bgColor: 'bg-teal-50',
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#FF385C]/10 text-[#FF385C] text-sm font-medium rounded-full mb-4">
            Lợi ích đối tác
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại sao nên hợp tác với chúng tôi?
          </h2>
          <p className="text-lg text-gray-600">
            Chúng tôi cung cấp các công cụ và dịch vụ tốt nhất để giúp khách sạn của bạn 
            phát triển và tối ưu hóa doanh thu.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`w-14 h-14 ${benefit.bgColor} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <Icon
                    size={28}
                    className={`bg-gradient-to-r ${benefit.color} bg-clip-text`}
                    style={{
                      color: benefit.color.includes('rose')
                        ? '#f43f5e'
                        : benefit.color.includes('blue')
                        ? '#3b82f6'
                        : benefit.color.includes('violet')
                        ? '#8b5cf6'
                        : benefit.color.includes('emerald')
                        ? '#10b981'
                        : benefit.color.includes('amber')
                        ? '#f59e0b'
                        : benefit.color.includes('sky')
                        ? '#0ea5e9'
                        : benefit.color.includes('yellow')
                        ? '#eab308'
                        : '#14b8a6',
                    }}
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FF385C] transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
