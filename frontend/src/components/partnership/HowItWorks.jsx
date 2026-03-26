import { ClipboardList, Building, CalendarCheck, Banknote, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Đăng ký đối tác',
    description:
      'Điền thông tin khách sạn của bạn vào form đăng ký. Đội ngũ của chúng tôi sẽ xem xét và liên hệ trong vòng 24 giờ.',
    color: 'bg-[#FF385C]',
  },
  {
    number: '02',
    icon: Building,
    title: 'Thiết lập khách sạn',
    description:
      'Thêm thông tin chi tiết về phòng, giá cả, hình ảnh và các tiện nghi. Chúng tôi sẽ hỗ trợ bạn trong quá trình này.',
    color: 'bg-blue-500',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Nhận đặt phòng',
    description:
      'Khách sạn của bạn sẽ xuất hiện trên nền tảng và bắt đầu nhận đặt phòng từ hàng triệu khách hàng.',
    color: 'bg-emerald-500',
  },
  {
    number: '04',
    icon: Banknote,
    title: 'Nhận thanh toán',
    description:
      'Thanh toán được xử lý an toàn và chuyển vào tài khoản của bạn theo chu kỳ đã thỏa thuận.',
    color: 'bg-violet-500',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-medium rounded-full mb-4">
            Quy trình hợp tác
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bắt đầu chỉ với 4 bước đơn giản
          </h2>
          <p className="text-lg text-gray-600">
            Quy trình đăng ký nhanh chóng và dễ dàng. Chúng tôi sẽ hỗ trợ bạn trong suốt quá trình.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#FF385C] via-blue-500 to-violet-500" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step Card */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow group">
                    {/* Number Badge */}
                    <div
                      className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={32} className="text-white" />
                    </div>

                    {/* Step Number */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl font-bold text-gray-200">
                        {step.number}
                      </span>
                      {index < steps.length - 1 && (
                        <ArrowRight
                          size={20}
                          className="text-gray-300 hidden lg:block"
                        />
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-4 lg:hidden">
                      <ArrowRight
                        size={24}
                        className="text-gray-300 rotate-90"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Sẵn sàng bắt đầu? Đăng ký ngay hôm nay và nhận ưu đãi đặc biệt!
          </p>
          <a
            href="#register-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF385C] text-white font-semibold rounded-xl hover:bg-[#E31C5F] transition-colors cursor-pointer group"
          >
            Đăng ký ngay
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
