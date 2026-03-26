import { useState, useMemo, useEffect } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  BlogCard,
  BlogList,
  BlogSearch,
  BlogSidebar,
  BlogPagination,
} from "../components/blog";
import api from "../services/api";

const ITEMS_PER_PAGE = 6;

const normalizeBlog = (blog) => ({
  ...blog,
  id: blog._id || blog.id,
  categoryId: blog.categoryId || blog.category || "",
  category: blog.categoryName || blog.category || "",
  author: typeof blog.author === "object"
    ? blog.author
    : { name: blog.author || "Admin", avatar: "" },
  date: blog.date || (blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""),
  readTime: blog.readTime || blog.readingTime || 5,
  image: blog.thumbnail || blog.image || "",
  description: blog.shortDescription || blog.description || blog.excerpt || "",
});

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.getBlogs({ status: "published" })
      .then((res) => {
        const data = res.data || res.blogs || res || [];
        setBlogs((Array.isArray(data) ? data : []).map(normalizeBlog));
      })
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const featuredBlog = useMemo(
    () => blogs.find((blog) => blog.featured),
    [blogs]
  );

  const filteredBlogs = useMemo(() => {
    let result = blogs.filter((blog) => !blog.featured);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          (blog.description || "").toLowerCase().includes(term) ||
          (blog.category || "").toLowerCase().includes(term)
      );
    }

    if (activeCategory) {
      result = result.filter(
        (blog) =>
          blog.categoryId === activeCategory ||
          blog.category === activeCategory
      );
    }

    return result;
  }, [blogs, searchTerm, activeCategory]);

  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24" />

      {featuredBlog && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="relative">
            <div className="absolute -top-3 left-6 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-amber-900 text-sm font-medium rounded-full shadow-lg">
                <Sparkles size={14} />
                Nổi bật
              </span>
            </div>
            <BlogCard blog={featuredBlog} featured />
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <BlogSearch onSearch={handleSearch} />
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredBlogs.length > 0 ? (
                  <>
                    Hiển thị{" "}
                    <span className="font-medium text-gray-900">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredBlogs.length)}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium text-gray-900">
                      {filteredBlogs.length}
                    </span>{" "}
                    bài viết
                  </>
                ) : (
                  "Không có bài viết nào"
                )}
              </p>
              {(searchTerm || activeCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("");
                    setCurrentPage(1);
                  }}
                  className="text-sm text-[#FF385C] hover:underline cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>

            <BlogList blogs={paginatedBlogs} />

            {totalPages > 1 && (
              <div className="mt-10">
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          <div className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24">
              <BlogSidebar
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
