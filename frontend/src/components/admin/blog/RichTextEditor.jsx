import { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Quote,
  Heading1,
  Heading2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
} from "lucide-react";

const ToolButton = ({ icon: Icon, active, onClick, title }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault(); // Prevent losing focus from editor
      onClick();
    }}
    title={title}
    className={`p-2 rounded-lg transition-colors cursor-pointer ${
      active ? "bg-[#FF385C] text-white" : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon size={18} />
  </button>
);

const RichTextEditor = ({ value, onChange, error }) => {
  const [activeFormats, setActiveFormats] = useState(new Set());
  const editorRef = useRef(null);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const currentContent = editorRef.current.innerHTML;
      if (value !== currentContent) {
        // Save cursor position
        const selection = window.getSelection();
        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        const cursorOffset = range ? range.startOffset : 0;
        const cursorNode = range ? range.startContainer : null;

        editorRef.current.innerHTML = value || "";

        // Restore cursor position
        if (cursorNode && editorRef.current.contains(cursorNode)) {
          try {
            const newRange = document.createRange();
            newRange.setStart(cursorNode, Math.min(cursorOffset, cursorNode.length || 0));
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } catch (e) {
            // Ignore cursor restoration errors
          }
        }
      }
    }
  }, [value]);

  const updateActiveFormats = () => {
    const formats = new Set();
    
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    if (document.queryCommandState("insertUnorderedList")) formats.add("ul");
    if (document.queryCommandState("insertOrderedList")) formats.add("ol");
    if (document.queryCommandState("justifyLeft")) formats.add("left");
    if (document.queryCommandState("justifyCenter")) formats.add("center");
    if (document.queryCommandState("justifyRight")) formats.add("right");

    // Check for block formats
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      let node = selection.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeType === 1) {
          const tagName = node.tagName?.toLowerCase();
          if (tagName === "h1") formats.add("h1");
          if (tagName === "h2") formats.add("h2");
          if (tagName === "blockquote") formats.add("quote");
          if (tagName === "pre") formats.add("code");
        }
        node = node.parentNode;
      }
    }

    setActiveFormats(formats);
  };

  const handleInput = () => {
    if (editorRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      const sanitized = DOMPurify.sanitize(editorRef.current.innerHTML, {
        ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'strong', 'em', 'u', 'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'div'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style'],
      });
      onChange(sanitized);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  };

  const handleSelectionChange = () => {
    if (editorRef.current && editorRef.current.contains(document.activeElement)) {
      updateActiveFormats();
    }
  };

  const handleKeyDown = (e) => {
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          toggleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          toggleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          toggleFormat('underline');
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const execCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    
    // Update formats immediately after command
    setTimeout(() => {
      updateActiveFormats();
      handleInput();
    }, 0);
  };

  const toggleFormat = (format) => {
    switch (format) {
      case "bold":
        execCommand("bold");
        break;
      case "italic":
        execCommand("italic");
        break;
      case "underline":
        execCommand("underline");
        break;
      case "h1":
        execCommand("formatBlock", "<h1>");
        break;
      case "h2":
        execCommand("formatBlock", "<h2>");
        break;
      case "left":
        execCommand("justifyLeft");
        break;
      case "center":
        execCommand("justifyCenter");
        break;
      case "right":
        execCommand("justifyRight");
        break;
      case "ul":
        execCommand("insertUnorderedList");
        break;
      case "ol":
        execCommand("insertOrderedList");
        break;
      case "quote":
        execCommand("formatBlock", "<blockquote>");
        break;
      case "code":
        execCommand("formatBlock", "<pre>");
        break;
      case "link":
        const url = prompt("Nhập URL:");
        if (url) {
          execCommand("createLink", url);
        }
        break;
      case "image":
        const imgUrl = prompt("Nhập URL hình ảnh:");
        if (imgUrl) {
          execCommand("insertImage", imgUrl);
        }
        break;
      default:
        break;
    }
  };

  const toolGroups = [
    {
      tools: [
        { icon: Heading1, format: "h1", title: "Heading 1" },
        { icon: Heading2, format: "h2", title: "Heading 2" },
      ],
    },
    {
      tools: [
        { icon: Bold, format: "bold", title: "In đậm" },
        { icon: Italic, format: "italic", title: "In nghiêng" },
        { icon: Underline, format: "underline", title: "Gạch chân" },
      ],
    },
    {
      tools: [
        { icon: AlignLeft, format: "left", title: "Căn trái" },
        { icon: AlignCenter, format: "center", title: "Căn giữa" },
        { icon: AlignRight, format: "right", title: "Căn phải" },
      ],
    },
    {
      tools: [
        { icon: List, format: "ul", title: "Danh sách" },
        { icon: ListOrdered, format: "ol", title: "Danh sách số" },
        { icon: Quote, format: "quote", title: "Trích dẫn" },
      ],
    },
    {
      tools: [
        { icon: Link, format: "link", title: "Chèn link" },
        { icon: Image, format: "image", title: "Chèn ảnh" },
        { icon: Code, format: "code", title: "Code" },
      ],
    },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Nội dung bài viết <span className="text-red-500">*</span>
      </label>

      <div
        className={`border rounded-xl overflow-hidden transition-colors ${
          error
            ? "border-red-300"
            : "border-gray-200 focus-within:border-[#FF385C]"
        }`}
      >
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
          {toolGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex items-center">
              {group.tools.map((tool) => (
                <ToolButton
                  key={tool.format}
                  icon={tool.icon}
                  active={activeFormats.has(tool.format)}
                  onClick={() => toggleFormat(tool.format)}
                  title={tool.title}
                />
              ))}
              {groupIndex < toolGroups.length - 1 && (
                <div className="w-px h-6 bg-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Editor Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          onKeyDown={handleKeyDown}
          onFocus={updateActiveFormats}
          className="w-full min-h-[400px] p-4 outline-none text-gray-700 leading-relaxed prose prose-sm max-w-none"
          style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}
          suppressContentEditableWarning
          data-placeholder="Viết nội dung bài viết của bạn ở đây...

Bạn có thể sử dụng các công cụ định dạng ở trên để tạo nội dung phong phú hơn.

Ví dụ:
- Bôi đen văn bản và click nút để định dạng
- Sử dụng Heading để tạo tiêu đề
- In đậm, in nghiêng cho các từ quan trọng
- Tạo danh sách để liệt kê
- Chèn link và hình ảnh

Phím tắt: Ctrl+B (đậm), Ctrl+I (nghiêng), Ctrl+U (gạch chân)"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      <p className="mt-2 text-xs text-gray-400">
        💡 Mẹo: Bôi đen văn bản và click nút định dạng, hoặc dùng Ctrl+B (đậm), Ctrl+I (nghiêng), Ctrl+U (gạch chân)
      </p>
    </div>
  );
};

export default RichTextEditor;
