import { useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';
import StarRating from './StarRating';
import api from '../services/api';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

/**
 * ReviewForm
 * Props:
 *   hotelId      – string
 *   hotelName    – string
 *   booking      – { _id, checkInDate, checkOutDate, roomId: { title } }
 *   onSuccess    – (newReview) => void
 *   onClose      – () => void
 */
const ReviewForm = ({ hotelId, hotelName, booking, onSuccess, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!rating) errs.rating = 'Vui lòng chọn số sao đánh giá';
    if (!comment.trim()) errs.comment = 'Vui lòng nhập nhận xét';
    else if (comment.trim().length < 10) errs.comment = 'Nhận xét phải có ít nhất 10 ký tự';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await api.createReview({
        hotelId,
        bookingId: booking._id,
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
      onSuccess?.(res.data);
    } catch (err) {
      setApiError(err.message || 'Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cảm ơn bạn!</h3>
          <p className="text-gray-500 mb-6">Đánh giá của bạn đã được gửi thành công.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#FF385C] text-white rounded-xl font-medium hover:bg-[#E31C5F] transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Viết đánh giá</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Booking info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <p className="font-semibold text-gray-900 text-base">{hotelName}</p>
          {booking.roomId?.title && (
            <p className="text-sm text-gray-500 mt-0.5">{booking.roomId.title}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span>
              Nhận phòng:{' '}
              <span className="font-medium text-gray-700">
                {formatDate(booking.checkInDate)}
              </span>
            </span>
            <span className="text-gray-300">·</span>
            <span>
              Trả phòng:{' '}
              <span className="font-medium text-gray-700">
                {formatDate(booking.checkOutDate)}
              </span>
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá tổng thể <span className="text-[#FF385C]">*</span>
            </label>
            <StarRating value={rating} onChange={(v) => { setRating(v); setErrors((e) => ({ ...e, rating: '' })); }} size="md" />
            {errors.rating && (
              <p className="mt-1.5 text-sm text-red-500">{errors.rating}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nhận xét của bạn <span className="text-[#FF385C]">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => { setComment(e.target.value); setErrors((err) => ({ ...err, comment: '' })); }}
              placeholder="Chia sẻ trải nghiệm của bạn về khách sạn này..."
              rows={4}
              maxLength={1000}
              className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-900 placeholder-gray-400 resize-none outline-none transition-all ${
                errors.comment
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-200 focus:border-[#FF385C] focus:ring-2 focus:ring-[#FF385C]/20'
              }`}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.comment ? (
                <p className="text-sm text-red-500">{errors.comment}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">{comment.length}/1000</span>
            </div>
          </div>

          {apiError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {apiError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-[#FF385C] text-white rounded-xl font-medium hover:bg-[#E31C5F] disabled:opacity-60 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
