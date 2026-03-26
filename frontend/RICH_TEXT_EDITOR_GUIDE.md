# Hướng dẫn sử dụng Rich Text Editor

## Trải nghiệm giống Microsoft Word

Rich Text Editor đã được nâng cấp để hoạt động mượt mà như Microsoft Word với các tính năng:

### ✨ Tính năng chính:

1. **Định dạng theo thời gian thực**
   - Bôi đen văn bản và click nút định dạng
   - Nút định dạng sẽ sáng lên khi văn bản đang được định dạng
   - Con trỏ chuột không bị nhảy khi định dạng

2. **Phím tắt (giống Word)**
   - Ctrl+B hoặc Cmd+B: In đậm
   - Ctrl+I hoặc Cmd+I: In nghiêng
   - Ctrl+U hoặc Cmd+U: Gạch chân

3. **Các công cụ định dạng:**

   **Tiêu đề:**
   - H1: Tiêu đề cấp 1 (lớn nhất)
   - H2: Tiêu đề cấp 2

   **Định dạng văn bản:**
   - In đậm (Bold) - Ctrl+B
   - In nghiêng (Italic) - Ctrl+I
   - Gạch chân (Underline) - Ctrl+U

   **Căn chỉnh:**
   - Căn trái
   - Căn giữa
   - Căn phải

   **Danh sách:**
   - Danh sách không thứ tự (bullet points)
   - Danh sách có thứ tự (numbered list)

   **Khác:**
   - Trích dẫn (Blockquote)
   - Code block
   - Chèn link
   - Chèn hình ảnh

### 📝 Cách sử dụng:

1. **Định dạng văn bản có sẵn:**
   - Bôi đen văn bản bạn muốn định dạng
   - Click vào nút công cụ tương ứng trên toolbar
   - Nút sẽ sáng màu đỏ khi định dạng đang được áp dụng

2. **Định dạng khi gõ:**
   - Click vào nút định dạng trước
   - Gõ văn bản mới
   - Văn bản sẽ được định dạng tự động

3. **Sử dụng phím tắt:**
   - Bôi đen văn bản
   - Nhấn Ctrl+B (đậm), Ctrl+I (nghiêng), hoặc Ctrl+U (gạch chân)

### 🔒 Bảo mật:

- Tất cả HTML content được sanitize bằng DOMPurify
- Chỉ cho phép các thẻ HTML an toàn
- Tự động loại bỏ các script và code độc hại

### 🛠️ Kỹ thuật:

- Sử dụng `contentEditable` với `document.execCommand`
- Theo dõi trạng thái định dạng theo thời gian thực
- Ngăn chặn mất focus khi click nút định dạng
- Lưu và khôi phục vị trí con trỏ
- Sanitize HTML trước khi lưu và hiển thị

### 💡 Mẹo:

- Nút định dạng sẽ sáng lên khi con trỏ ở vị trí có định dạng đó
- Di chuyển con trỏ để xem định dạng hiện tại
- Có thể kết hợp nhiều định dạng (đậm + nghiêng + gạch chân)
- Sử dụng phím tắt để làm việc nhanh hơn
