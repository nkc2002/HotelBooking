import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Chi phí đăng ký hợp tác là bao nhiêu?',
    answer:
      'Hoàn toàn miễn phí! Bạn không cần trả bất kỳ chi phí nào để đăng ký và liệt kê khách sạn trên nền tảng của chúng tôi. Chúng tôi chỉ thu hoa hồng khi có đặt phòng thành công.',
  },
  {
    question: 'Mức hoa hồng là bao nhiêu?',
    answer:
      'Mức hoa hồng dao động từ 10-15% tùy thuộc vào loại hình khách sạn và gói dịch vụ bạn chọn. Chúng tôi cam kết mức hoa hồng cạnh tranh nhất trên thị trường.',
  },
  {
    question: 'Thời gian xét duyệt hồ sơ là bao lâu?',
    answer:
      'Thông thường, chúng tôi sẽ xem xét và phản hồi hồ sơ của bạn trong vòng 24-48 giờ làm việc. Sau khi được duyệt, bạn có thể bắt đầu thiết lập khách sạn ngay lập tức.',
  },
  {
    question: 'Tôi có thể quản lý giá và tình trạng phòng như thế nào?',
    answer:
      'Bạn sẽ có quyền truy cập vào dashboard quản lý riêng, nơi bạn có thể cập nhật giá, tình trạng phòng, hình ảnh và thông tin khách sạn bất cứ lúc nào. Mọi thay đổi sẽ được cập nhật ngay lập tức.',
  },
  {
    question: 'Thanh toán được xử lý như thế nào?',
    answer:
      'Chúng tôi xử lý thanh toán từ khách hàng và chuyển tiền cho bạn theo chu kỳ hàng tuần hoặc hàng tháng (tùy chọn). Bạn sẽ nhận được báo cáo chi tiết về mỗi giao dịch.',
  },
  {
    question: 'Tôi có thể hủy hợp tác bất cứ lúc nào không?',
    answer:
      'Có, bạn có thể ngừng hợp tác bất cứ lúc nào mà không bị phạt. Chúng tôi chỉ yêu cầu thông báo trước 30 ngày để xử lý các đặt phòng đã có.',
  },
  {
    question: 'HotelBooking có hỗ trợ marketing không?',
    answer:
      'Có! Chúng tôi cung cấp các công cụ marketing như chương trình khuyến mãi, flash sale, và hiển thị ưu tiên. Ngoài ra, khách sạn của bạn sẽ được quảng bá trên các kênh marketing của chúng tôi.',
  },
  {
    question: 'Làm sao để liên hệ hỗ trợ khi cần?',
    answer:
      'Đội ngũ hỗ trợ đối tác của chúng tôi hoạt động 24/7. Bạn có thể liên hệ qua hotline 1900 1234 (Ext: 2), email partner@hotelbooking.com, hoặc chat trực tiếp trên dashboard.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-600 text-sm font-medium rounded-full mb-4">
            Câu hỏi thường gặp
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bạn có thắc mắc?
          </h2>
          <p className="text-lg text-gray-600">
            Tìm câu trả lời cho những câu hỏi phổ biến nhất về chương trình đối tác.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? 'border-[#FF385C] shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      openIndex === index
                        ? 'bg-[#FF385C] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <HelpCircle size={20} />
                  </div>
                  <span
                    className={`font-semibold transition-colors ${
                      openIndex === index ? 'text-[#FF385C]' : 'text-gray-900'
                    }`}
                  >
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition-transform duration-300 shrink-0 ml-4 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#FF385C] to-[#E31C5F] rounded-2xl p-8 text-center text-white">
          <MessageCircle size={40} className="mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-semibold mb-2">
            Vẫn còn thắc mắc?
          </h3>
          <p className="text-white/80 mb-6">
            Đội ngũ hỗ trợ của chúng tôi sẵn sàng giải đáp mọi câu hỏi của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="tel:19001234"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#FF385C] font-medium rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Gọi 1900 1234
            </a>
            <a
              href="mailto:partner@hotelbooking.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-medium rounded-xl hover:bg-white/30 transition-colors cursor-pointer"
            >
              Gửi email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
