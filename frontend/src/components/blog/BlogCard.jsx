import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, featured = false }) => {
  if (featured) {
    return (
      <div className="relative group overflow-hidden rounded-2xl">
        <div className="aspect-[16/9] md:aspect-[21/9]">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="inline-block px-3 py-1 bg-[#FF385C] text-white text-sm font-medium rounded-full mb-4">
            {blog.category}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 line-clamp-2">
            {blog.title}
          </h2>
          <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl">
            {blog.description}
          </p>
          <div className="flex items-center gap-6 text-gray-300 text-sm mb-6">
            <div className="flex items-center gap-2">
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{blog.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{blog.date}</span>
            </div>
          </div>
          <Link
            to={`/blog/${blog.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Đọc tiếp
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow group">
      <Link to={`/blog/${blog.id}`} className="block overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-1 bg-[#FF385C]/10 text-[#FF385C] text-xs font-medium rounded-full">
            {blog.category}
          </span>
          <span className="text-xs text-gray-400">{blog.readTime} phút đọc</span>
        </div>
        <Link to={`/blog/${blog.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF385C] transition-colors">
            {blog.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {blog.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{blog.author.name}</p>
              <p className="text-xs text-gray-500">{blog.date}</p>
            </div>
          </div>
          <Link
            to={`/blog/${blog.id}`}
            className="text-[#FF385C] hover:text-[#E31C5F] font-medium text-sm flex items-center gap-1 group/link"
          >
            Đọc tiếp
            <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
