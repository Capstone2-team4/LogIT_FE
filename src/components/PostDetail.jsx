import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentView, setCurrentView] = useState("home"); // "home" 또는 "editor"

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          `http://localhost:8080/records/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setPost(response.data.result); // 백엔드에서 result로 감싸서 오면
      } catch (error) {
        console.error("❌ 게시글 불러오기 실패:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  // 날짜 포맷팅: yyyy.MM.dd
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen w-full">
      {/* 왼쪽 사이드바 */}
      <LeftSidebar onNavigate={handleNavigate} currentView={currentView} />

      {/* 오른쪽 콘텐츠 */}
      <div className="flex-1 overflow-y-auto px-8 py-12 max-w-3xl mx-auto">
        {/* 제목 */}
        <h1 className="text-4xl font-extrabold mb-3 leading-tight">
          {post.title}
        </h1>

        {/* 작성자 / 날짜 */}
        <div className="text-gray-400 text-sm font-light mb-8">
          <span className="font-semibold">{post.author}</span> · {formattedDate}
        </div>

        {/* 본문 내용 */}
        <div className="text-lg leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
