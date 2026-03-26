import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Heart,
  MessageCircle,
  Bookmark,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const normalizeBlog = (blog) => ({
  ...blog,
  id: blog._id || blog.id,
  image: blog.thumbnail || blog.image || "",
  category: blog.categoryName || blog.category || "",
  author: typeof blog.author === "object"
    ? { ...blog.author, bio: blog.author.bio || "" }
    : { name: blog.author || "Admin", avatar: "", bio: "" },
  date: blog.date || (blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""),
  readTime: blog.readTime || blog.readingTime || 5,
  views: blog.views || 0,
  likes: blog.likes || 0,
  comments: blog.comments || 0,
  content: blog.content || "",
  tags: blog.tags || [],
  relatedPosts: (blog.relatedPosts || []).map((p) => ({
    ...p,
    id: p._id || p.id,
    image: p.thumbnail || p.image || "",
    category: p.categoryName || p.category || "",
    date: p.date || (p.createdAt
      ? new Date(p.createdAt).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : ""),
  })),
});

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getBlog(id),
      api.getRelatedBlogs(id).catch(() => ({ data: [] })),
    ])
      .then(([blogRes, relatedRes]) => {
        const blogData = blogRes.data || blogRes;
        const relatedData = relatedRes.data || relatedRes.blogs || relatedRes || [];
        setBlog(normalizeBlog({ ...blogData, relatedPosts: Array.isArray(relatedData) ? relatedData : [] }));
      })
      .catch(() => setBlog(null))
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
  }, [id]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Đã sao chép liên kết!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const formatViews = (views) => {
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF385C] border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">Không tìm thấy bài viết</p>
            <Link to="/blog" className="text-[#FF385C] hover:underline">
              Quay lại Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="relative h-[50vh] md:h-[60vh]">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <Link
          to="/blog"
          className="absolute top-24 left-4 md:left-8 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 bg-[#FF385C] text-white text-sm font-medium rounded-full mb-4">
              {blog.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                {blog.author.avatar && (
                  <img
                    src={blog.author.avatar}
                    alt={blog.author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                  />
                )}
                <span className="font-medium text-white">{blog.author.name}</span>
              </div>
              {blog.date && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{blog.date}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{blog.readTime} phút đọc</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            {blog.views > 0 && <span>{formatViews(blog.views)} lượt xem</span>}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLiked ? 'text-[#FF385C]' : 'hover:text-[#FF385C]'
              }`}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              <span>{blog.likes + (isLiked ? 1 : 0)}</span>
            </button>
            {blog.comments > 0 && (
              <span className="flex items-center gap-1.5">
                <MessageCircle size={18} />
                <span>{blog.comments}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#FF385C]/10 text-[#FF385C]'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
              title="Lưu bài viết"
            >
              <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-gray-500"
                title="Chia sẻ"
              >
                <Share2 size={20} />
              </button>
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer"
                  >
                    <Facebook size={18} className="text-blue-600" />
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer"
                  >
                    <Twitter size={18} className="text-sky-500" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer"
                  >
                    <Linkedin size={18} className="text-blue-700" />
                    LinkedIn
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700 cursor-pointer"
                  >
                    <LinkIcon size={18} />
                    Sao chép liên kết
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <article
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#FF385C] prose-img:rounded-xl prose-blockquote:border-l-[#FF385C] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-li:text-gray-600"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
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
        )}

        <div className="mt-10 p-6 bg-white rounded-2xl border border-gray-200">
          <div className="flex items-start gap-4">
            {blog.author.avatar && (
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                {blog.author.name}
              </h4>
              {blog.author.bio && (
                <p className="text-gray-600 text-sm mb-3">{blog.author.bio}</p>
              )}
              <button className="text-sm text-[#FF385C] font-medium hover:underline cursor-pointer">
                Xem tất cả bài viết
              </button>
            </div>
          </div>
        </div>
      </div>

      {blog.relatedPosts && blog.relatedPosts.length > 0 && (
        <section className="bg-white py-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blog.relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-[#FF385C] font-medium">
                      {post.category}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900 mt-2 line-clamp-2 group-hover:text-[#FF385C] transition-colors">
                      {post.title}
                    </h4>
                    {post.date && (
                      <p className="text-sm text-gray-500 mt-2">{post.date}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetail;
