import { useState, useEffect } from "react";
import { Save, Send, ArrowLeft, Eye, Sparkles } from "lucide-react";
import ImageUploader from "./ImageUploader";
import CategorySelect from "./CategorySelect";
import TagInput from "./TagInput";
import RichTextEditor from "./RichTextEditor";

const BlogForm = ({
  blog,
  onSubmit,
  onCancel,
  onPreview,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    thumbnail: "",
    category: "",
    shortDescription: "",
    content: "",
    tags: [],
    status: "draft",
    featured: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        thumbnail: blog.thumbnail || "",
        category: blog.category || "",
        shortDescription: blog.shortDescription || "",
        content: blog.content || "",
        tags: blog.tags || [],
        status: blog.status || "draft",
        featured: blog.featured || false,
      });
    }
  }, [blog]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề bài viết";
    }
    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Vui lòng nhập mô tả ngắn";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Vui lòng nhập nội dung bài viết";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status) => {
    if (!validate()) return;

    setIsSubmitting(true);

    const submitData = {
      ...formData,
      status,
      updatedAt: new Date().toISOString(),
    };

    if (!isEditing) {
      submitData.createdAt = new Date().toISOString();
      submitData.author = "Admin";
    }

    await onSubmit(submitData);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onPreview(formData)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Eye size={18} />
            Xem trước
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
        </h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className={`w-full px-4 py-3 border rounded-xl outline-none transition-colors ${
                errors.title
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-[#FF385C]"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
            {formData.slug && (
              <p className="mt-1 text-sm text-gray-400">
                Slug: <span className="text-gray-600">{formData.slug}</span>
              </p>
            )}
          </div>

          {/* Thumbnail */}
          <ImageUploader
            value={formData.thumbnail}
            onChange={(value) => handleChange("thumbnail", value)}
          />

          {/* Category */}
          <CategorySelect
            value={formData.category}
            onChange={(value) => handleChange("category", value)}
            error={errors.category}
          />

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả ngắn <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => handleChange("shortDescription", e.target.value)}
              placeholder="Mô tả ngắn gọn về bài viết (hiển thị trong danh sách)..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl outline-none resize-none transition-colors ${
                errors.shortDescription
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-[#FF385C]"
              }`}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-sm text-red-500">
                {errors.shortDescription}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {formData.shortDescription.length}/200 ký tự
            </p>
          </div>

          {/* Content */}
          <RichTextEditor
            value={formData.content}
            onChange={(value) => handleChange("content", value)}
            error={errors.content}
          />

          {/* Tags */}
          <TagInput
            value={formData.tags}
            onChange={(value) => handleChange("tags", value)}
          />

          {/* Featured */}
          <div>
            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Sparkles size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Bài viết nổi bật</p>
                  <p className="text-sm text-gray-500">
                    {formData.featured 
                      ? "Bài viết này đang được đánh dấu nổi bật"
                      : "Chỉ có 1 bài viết nổi bật tại một thời điểm"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleChange("featured", !formData.featured)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  formData.featured ? "bg-amber-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    formData.featured ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {formData.featured && (
              <p className="mt-2 text-xs text-amber-600">
                ⚠️ Lưu ý: Khi bạn lưu bài viết này, tất cả các bài viết nổi bật khác sẽ tự động bỏ trạng thái nổi bật.
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === "draft"}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-4 h-4 text-[#FF385C] focus:ring-[#FF385C]"
                />
                <span className="text-gray-700">Bản nháp</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === "published"}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-4 h-4 text-[#FF385C] focus:ring-[#FF385C]"
                />
                <span className="text-gray-700">Xuất bản ngay</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(formData.status || "published")}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#FF385C] text-white rounded-xl hover:bg-[#E31C5F] cursor-pointer transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isEditing ? "Cập nhật" : "Lưu bài viết"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
