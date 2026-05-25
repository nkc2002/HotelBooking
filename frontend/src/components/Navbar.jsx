import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  Globe,
  User,
  LogOut,
  CalendarCheck,
  Settings,
  X,
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleSearchClick = () => {
    navigate("/hotels");
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF385C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-semibold text-[#FF385C] hidden sm:block font-[Poppins]">
              HotelBooking
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF385C] hover:bg-[#FF385C]/5 rounded-full transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              to="/hotels"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF385C] hover:bg-[#FF385C]/5 rounded-full transition-colors"
            >
              Khách sạn
            </Link>
            <Link
              to="/blog"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF385C] hover:bg-[#FF385C]/5 rounded-full transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/partnership"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF385C] hover:bg-[#FF385C]/5 rounded-full transition-colors"
            >
              Hợp tác
            </Link>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowLanguageMenu(!showLanguageMenu);
                  setIsMenuOpen(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <Globe size={20} className="text-gray-700" />
              </button>
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Language
                    </p>
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setShowLanguageMenu(false);
                        alert(`Language changed to ${lang.name}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 border border-gray-300 rounded-full p-1 pl-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <Menu size={16} className="text-gray-700" />
                <div
                  className={`w-8 h-8 ${
                    isAuthenticated ? "bg-[#FF385C]" : "bg-gray-500"
                  } rounded-full flex items-center justify-center`}
                >
                  {isAuthenticated ? (
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <Link
                        to="/my-bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <CalendarCheck size={16} />
                        Đặt phòng của tôi
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <Heart size={16} />
                        Yêu thích
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          <Settings size={16} />
                          Bảng điều khiển quản trị
                        </Link>
                      )}
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 cursor-pointer"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Đăng ký
                      </Link>
                      <hr className="my-2 border-gray-200" />
                      <Link
                        to="/hotels"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Khám phá khách sạn
                      </Link>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          alert("Trung tâm trợ giúp sắp ra mắt!");
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Trung tâm trợ giúp
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <button
            onClick={handleSearchClick}
            className="w-full flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-full shadow-sm cursor-pointer"
          >
            <Search size={20} className="text-[#FF385C]" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Tìm khách sạn</p>
              <p className="text-xs text-gray-500">
                Địa điểm · Ngày · Số khách
              </p>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
