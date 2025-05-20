"use client";

import { useState, useEffect } from "react";
import LeftSidebar from "../components/LeftSidebar";
import EditorArea from "../components/EditorArea";
import BlogPostList from "../components/BlogPostList";
import axios from "axios";

const MainLayout = () => {
  const [currentView, setCurrentView] = useState("home"); // "home" 또는 "editor"
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get("http://localhost:8080/records/list", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const backendPosts = response.data.result.getRecordResultDTOList;
        const transformedPosts = backendPosts.map((p) => ({
          id: p.recordId,
          title: p.title,
          preview: [p.content],
          author: p.author || "Anonymous",
          date: new Date(p.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          tags: [],
        }));
        setPosts(transformedPosts);
      } catch (error) {
        console.error("❌ 글 목록 불러오기 실패:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleNavigate = (view) => setCurrentView(view);
  const handleNewPost = () => setCurrentView("editor");

  return (
    <div className="flex h-screen w-full">
      {/* 왼쪽 사이드바 */}
      <div className="w-16 border-r bg-white flex flex-col justify-between py-4">
        <LeftSidebar onNavigate={handleNavigate} currentView={currentView} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="w-full px-8 py-8">
          {currentView === "editor" ? (
            <EditorArea
              onUploadSuccess={() => setCurrentView("home")}
              setPosts={setPosts}
            />
          ) : (
            <div className="space-y-6">
              {/* 타이틀과 새 글 작성 버튼 */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  LogIT에 오신 것을 환영합니다!
                </h2>
                <button
                  onClick={handleNewPost}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  글 작성
                </button>
              </div>

              {/* 포스트 목록 - 넓은 영역에 배치 */}
              <BlogPostList posts={posts} onNewPost={handleNewPost} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
