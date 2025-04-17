import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";

// ✅ HTML 태그 제거 함수
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const BlogPostCard = ({ post }) => {
  return (
    <div className="py-6 border-b">
      {/* 작성자 & 날짜 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {post.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium">{post.author}</span>
          <span className="text-xs text-gray-500">{post.date}</span>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* 제목 */}
      <Link to={`/post/${post.id}`}>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      </Link>

      {/* 미리보기 본문: HTML 태그 제거 후 텍스트만 표시 */}
      <div className="mb-3">
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          {post.preview &&
            post.preview.map((line, index) => (
              <li key={index} className="text-sm text-gray-800">
                {stripHtml(line).slice(0, 100)} {/* 💬 최대 100자 제한 */}
              </li>
            ))}
        </ul>
      </div>

      {/* 태그 */}
      <div className="flex gap-2">
        {post.tags &&
          post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-xs rounded-md text-gray-700"
            >
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default BlogPostCard;
