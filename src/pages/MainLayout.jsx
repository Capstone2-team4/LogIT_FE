// 로그인 하면 보이는 메인 화면 (/main)
// 왼쪽바, 글 작성 창, 오른쪽바로 구성
import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import EditorArea from "../components/EditorArea";
import RightSidebar from "../components/RightSidebar";

const MainLayout = () => {
  return (
    <div className="flex w-screen min-h-screen text-gray-800 gap-x-6 px-6 ">
      <LeftSidebar />
      <EditorArea />
      <RightSidebar />
    </div>
  );
};

export default MainLayout;
