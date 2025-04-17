import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import axios from "axios";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentView, setCurrentView] = useState("home");

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

        setPost(response.data.result);
      } catch (error) {
        console.error("\u274C 게시글 불러오기 실패:", error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen w-full">
      <LeftSidebar onNavigate={handleNavigate} currentView={currentView} />

      <div className="flex-1 overflow-y-auto px-8 py-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-3 leading-tight">
          {post.title}
        </h1>
        <div className="text-gray-400 text-sm font-light mb-8">
          <span className="font-semibold">{post.author}</span> · {formattedDate}
        </div>

        {/* HTML로 저장된 내용 렌더링 */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
};

export default PostDetail;
