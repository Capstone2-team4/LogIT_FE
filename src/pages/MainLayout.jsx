import { useState, useEffect } from "react";
import LeftSidebar from "../components/LeftSidebar";
import EditorArea from "../components/EditorArea";
import RightSidebar from "../components/RightSidebar";
import BlogPostList from "../components/BlogPostList";
import axios from "axios";

const MainLayout = () => {
  const [currentView, setCurrentView] = useState("home"); // "home" 또는 "editor"
  const [posts, setPosts] = useState([
    {
      id: 0,
      author: "",
      date: "",
      title: "",
      preview: [],
      tags: [],
    },
  ]);

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get("http://localhost:8080/records/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("✅ 실제 응답:", response.data);

        const backendPosts = response.data.result.getRecordResultDTOList;

        // 변환!
        const transformedPosts = backendPosts.map(transformPostData);

        setPosts(transformedPosts);
      } catch (error) {
        console.error("❌ 글 목록 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, []);

  const transformPostData = (backendPost) => {
    return {
      id: backendPost.recordId,
      title: backendPost.title,
      preview: [backendPost.content], // 앞 2줄 미리보기
      author: backendPost.author, // 백엔드에 없으면 프론트에서 기본값
      date: new Date(backendPost.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      tags: [], // 아직 태그가 없으니까 빈 배열로 처리
    };
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleNewPost = () => {
    setCurrentView("editor");
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 사이드바 */}
        <LeftSidebar onNavigate={handleNavigate} currentView={currentView} />
        <div className="flex-1 p-4 flex gap-4">
          {/* 중앙 영역 */}
          <div className="w-[45%]">
            {currentView === "editor" ? (
              <EditorArea
                onUploadSuccess={() => setCurrentView("home")}
                setPosts={setPosts}
              />
            ) : (
              <BlogPostList posts={posts} onNewPost={handleNewPost} />
            )}
          </div>

          {/* 오른쪽 사이드바: 그대로 둠 (RightSidebar는 내부에서 너비 조절함) */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
