import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass,
  Building2,
  MapPin,
  Utensils,
  Tag,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

const categories = [
  { id: "travel-tips", name: "Mẹo Du Lịch", icon: Compass, count: 24 },
  {
    id: "hotel-reviews",
    name: "Đánh Giá Khách Sạn",
    icon: Building2,
    count: 18,
  },
  {
    id: "destination-guides",
    name: "Cẩm Nang Điểm Đến",
    icon: MapPin,
    count: 32,
  },
  { id: "food-culture", name: "Ẩm Thực & Văn Hóa", icon: Utensils, count: 15 },
];

const popularTags = [
  "Du lịch Việt Nam",
  "Khách sạn 5 sao",
  "Du lịch tiết kiệm",
  "Đà Nẵng",
  "Phú Quốc",
  "Nha Trang",
  "Sapa",
  "Hội An",
  "Đà Lạt",
  "Hạ Long",
];

const trendingPosts = [
  {
    id: 1,
    title: "10 khách sạn view biển đẹp nhất Việt Nam",
    views: 15420,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=100",
  },
  {
    id: 2,
    title: "Hướng dẫn du lịch Đà Nẵng tự túc 2024",
    views: 12350,
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=100",
  },
  {
    id: 3,
    title: "Top 5 resort nghỉ dưỡng cho gia đình",
    views: 9870,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=100",
  },
];

const BlogSidebar = ({ activeCategory, onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(
    activeCategory || "",
  );

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views;
  };

  return (
    <aside className="space-y-8">
      {/* Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#FF385C] rounded-full"></span>
          Danh mục
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer group ${
                    isActive
                      ? "bg-[#FF385C] text-white"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? "text-white"
                          : "text-gray-400 group-hover:text-[#FF385C]"
                      }
                    />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span
                    className={`text-sm px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {category.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {selectedCategory && (
          <button
            onClick={() => handleCategoryClick("")}
            className="w-full mt-4 text-sm text-[#FF385C] hover:underline cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Trending Posts */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-[#FF385C]" />
          Bài viết nổi bật
        </h3>
        <ul className="space-y-4">
          {trendingPosts.map((post, index) => (
            <li key={post.id}>
              <Link
                to={`/blog/${post.id}`}
                className="flex items-start gap-3 group"
              >
                <div className="relative shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-[#FF385C] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#FF385C] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatViews(post.views)} lượt xem
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Tag size={20} className="text-[#FF385C]" />
          Tags phổ biến
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              to={`/blog?tag=${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-[#FF385C] hover:text-white transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400"
          alt="Beach destination"
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h4 className="text-white font-semibold mb-2">
            Khám phá điểm đến mơ ước
          </h4>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-1 text-white/90 text-sm hover:text-white group"
          >
            Đặt phòng ngay
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
