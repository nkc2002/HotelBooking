import { useState } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  BedDouble,
  FileText,
  Send,
  CheckCircle,
  Loader2,
} from 'lucide-react';

const PartnerForm = () => {
  const [formData, setFormData] = useState({
    hotelName: '',
    contactPerson: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    numberOfRooms: '',
    description: '',
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const cities = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Nha Trang',
    'Phú Quốc',
    'Đà Lạt',
    'Hội An',
    'Hạ Long',
    'Sapa',
    'Huế',
    'Vũng Tàu',
    'Phan Thiết',
    'Cần Thơ',
    'Khác',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hotelName.trim()) {
      newErrors.hotelName = 'Vui lòng nhập tên khách sạn';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Vui lòng nhập tên người liên hệ';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.city) {
      newErrors.city = 'Vui lòng chọn thành phố';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    if (!formData.numberOfRooms) {
      newErrors.numberOfRooms = 'Vui lòng nhập số phòng';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Vui lòng đồng ý với điều khoản';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section id="register-form" className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Đăng ký thành công!
            </h3>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đăng ký hợp tác với HotelBooking. Đội ngũ của chúng tôi 
              sẽ xem xét thông tin và liên hệ với bạn trong vòng 24 giờ làm việc.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 text-left">
              <p className="text-sm text-gray-500 mb-2">Thông tin đã gửi:</p>
              <p className="font-medium text-gray-900">{formData.hotelName}</p>
              <p className="text-gray-600">{formData.email}</p>
              <p className="text-gray-600">{formData.phone}</p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  hotelName: '',
                  contactPerson: '',
                  email: '',
                  phone: '',
                  city: '',
                  address: '',
                  numberOfRooms: '',
                  description: '',
                  agreeTerms: false,
                });
              }}
              className="mt-6 px-6 py-3 bg-[#FF385C] text-white font-medium rounded-xl hover:bg-[#E31C5F] transition-colors cursor-pointer"
            >
              Đăng ký khách sạn khác
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register-form" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Info */}
          <div className="lg:sticky lg:top-24">
            <span className="inline-block px-4 py-1.5 bg-[#FF385C]/10 text-[#FF385C] text-sm font-medium rounded-full mb-4">
              Đăng ký đối tác
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đăng ký khách sạn của bạn
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Điền thông tin bên dưới để bắt đầu hành trình hợp tác. Chúng tôi sẽ liên hệ 
              với bạn trong thời gian sớm nhất.
            </p>

            {/* Benefits List */}
            <div className="space-y-4">
              {[
                'Miễn phí đăng ký và không có phí ẩn',
                'Hỗ trợ thiết lập hoàn toàn miễn phí',
                'Hoa hồng cạnh tranh nhất thị trường',
                'Thanh toán nhanh chóng và minh bạch',
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">
                Cần hỗ trợ thêm?
              </h4>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center gap-2">
                  <Mail size={18} className="text-[#FF385C]" />
                  partner@hotelbooking.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={18} className="text-[#FF385C]" />
                  1900 1234 (Ext: 2)
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Hotel Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tên khách sạn <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="hotelName"
                    value={formData.hotelName}
                    onChange={handleChange}
                    placeholder="VD: Khách sạn Mường Thanh"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-colors ${
                      errors.hotelName
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#FF385C]'
                    }`}
                  />
                </div>
                {errors.hotelName && (
                  <p className="mt-1 text-sm text-red-500">{errors.hotelName}</p>
                )}
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Người liên hệ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Họ và tên"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-colors ${
                      errors.contactPerson
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#FF385C]'
                    }`}
                  />
                </div>
                {errors.contactPerson && (
                  <p className="mt-1 text-sm text-red-500">{errors.contactPerson}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-colors ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#FF385C]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0912 345 678"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-colors ${
                        errors.phone
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#FF385C]'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* City & Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thành phố <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-colors appearance-none bg-white ${
                        errors.city
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#FF385C]'
                      }`}
                    >
                      <option value="">Chọn thành phố</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số phòng <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BedDouble
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      name="numberOfRooms"
                      value={formData.numberOfRooms}
                      onChange={handleChange}
                      placeholder="VD: 50"
                      min="1"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-colors ${
                        errors.numberOfRooms
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#FF385C]'
                      }`}
                    />
                  </div>
                  {errors.numberOfRooms && (
                    <p className="mt-1 text-sm text-red-500">{errors.numberOfRooms}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home
                    size={20}
                    className="absolute left-4 top-3 text-gray-400"
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, đường, quận/huyện"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-colors ${
                      errors.address
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#FF385C]'
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mô tả khách sạn
                </label>
                <div className="relative">
                  <FileText
                    size={20}
                    className="absolute left-4 top-3 text-gray-400"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Giới thiệu ngắn về khách sạn của bạn..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#FF385C] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                  />
                  <span className="text-sm text-gray-600">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-[#FF385C] hover:underline">
                      Điều khoản dịch vụ
                    </a>{' '}
                    và{' '}
                    <a href="#" className="text-[#FF385C] hover:underline">
                      Chính sách bảo mật
                    </a>{' '}
                    của HotelBooking.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="mt-1 text-sm text-red-500">{errors.agreeTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FF385C] text-white font-semibold text-lg rounded-xl hover:bg-[#E31C5F] transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Gửi đăng ký
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerForm;
