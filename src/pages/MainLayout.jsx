import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동용
import LeftSidebar from "../components/LeftSidebar";
import EditorArea from "../components/EditorArea";
import BlogPostList from "../components/BlogPostList";
import OwnerRepoSelectModal from "../components/OwnerRepoSelectModal"; // ✅ 오너/레포 선택 모달
import axios from "axios";
import API from "../config";

const MainLayout = () => {
  const [currentView, setCurrentView] = useState("home");
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태

  const navigate = useNavigate(); // ✅ 페이지 이동

  // 선택된 깃허브 소유자 / 저장소
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(API.GET_RECORD_LIST, {
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

  const handleNewPost = () => {
    setShowModal(true); // ✅ 모달 띄우기
  };

  const handleModalConfirm = (owner, repo) => {
    setSelectedOwner(owner);
    setSelectedRepo(repo);
    setShowModal(false);
    navigate("/editor", {
      state: { owner, repo }, // ✅ 선택값 전달
    });
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

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
              selectedOwner={selectedOwner}
              selectedRepo={selectedRepo}
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

              {/* 포스트 목록 */}
              <BlogPostList posts={posts} onNewPost={handleNewPost} />
            </div>
          )}
        </div>
      </div>

      {/* Owner / Repo 선택 모달 */}
      {showModal && (
        <OwnerRepoSelectModal
          onClose={handleModalCancel}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};

export default MainLayout;
