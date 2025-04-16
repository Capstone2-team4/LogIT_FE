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

  // // 임시 블로그 글 데이터 (나중에 백엔드 데이터로 대체)
  // const posts = [
  //   {
  //     id: 1,
  //     author: "사용자",
  //     date: "4 days ago",
  //     title: "로그인 화면 구현",
  //     preview: [
  //       "Javascript의 dom형태로 기능을 구현하는 것이 처음이라 많이 막혔지만 해결 방식을 참 정리해두고 배운 개념, 모르는 개념을 검색하면서 찾아내어 첫 로그인 페이지를 완성했다.",
  //       "구현 방법...",
  //     ],
  //     tags: ["JavaScript"],
  //   },
  //   {
  //     id: 2,
  //     author: "사용자",
  //     date: "7 days ago",
  //     title: "java.lang.nullpointerexception 오류",
  //     preview: [
  //       "JAVA, C를 이용하여 개발하다 보면 java.lang.nullpointerexception 오류가 자주 이 발생한다. 뭔가 뻔했다는 것 같은데, 원인은 간단하다.",
  //       "흔한 객체 생성 후 인스턴스를 설정하지 않은 상태에서 NULL 오브젝트를 사용시 종종서 발생...",
  //     ],
  //     tags: ["Java"],
  //   },
  //   {
  //     id: 3,
  //     author: "사용자",
  //     date: "12 days ago",
  //     title: "Cookie 설정하기, value 가져오기, 삭제하기",
  //     preview: [
  //       "오늘 하루 보지 않기 기능을 구현할 때, Local Storage나 Cookies를 사용한다.",
  //       "Local Storage는 간단하게 key-value 형식으로 저장할 수 있지만 Cookies를 사용하게 되면 만료기간을 설정 시에 저장할 수 있어서...",
  //     ],
  //     tags: ["JavaScript", "Web"],
  //   },
  // ];

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
