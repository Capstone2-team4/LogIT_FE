import { useState } from "react";
import axios from "axios";

const EditorArea = ({ onUploadSuccess, setPosts }) => {
  const [editorContent, setEditorContent] = useState("");
  const [editorTitle, setEditorTitle] = useState("");

  const handleUpload = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        "http://localhost:8080/records/",
        {
          title: editorTitle,
          content: editorContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("✅ 업로드 성공:", response.data);
      alert("업로드 완료!");

      const backendPost = response.data.result;
      const transformedPost = transformPostData(backendPost);
      // ✅ 여기서 직접 setPosts 호출!
      setPosts((prev) => [transformedPost, ...prev]);
      onUploadSuccess?.();

      // 원하면 초기화도 가능
      setEditorTitle("");
      setEditorContent("");
    } catch (error) {
      console.error("❌ 업로드 실패:", error);
      alert("업로드 실패! 서버 확인 필요.");
    }
  };

  const transformPostData = (backendPost) => {
    return {
      id: backendPost.recordId,
      title: backendPost.title,
      author: backendPost.author,
      preview: [backendPost.content], // 앞 2줄 미리보기
      date: new Date(backendPost.createdAt).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      tags: [], // 아직 태그가 없으니까 빈 배열로 처리
    };
  };

  return (
    <div className="h-screen flex-1 max-w-3xl py-10">
      <div className="border rounded-md h-full flex flex-col">
        <div className="border-b p-3">
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-xl font-medium focus:outline-none"
          />
        </div>
        <div className="flex-1 p-3">
          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            placeholder="내용을 입력하세요..."
            className="w-full h-full resize-none focus:outline-none"
          ></textarea>
        </div>
        <div className="border-t p-3 flex justify-end gap-2">
          <button
            onClick={handleUpload}
            className="px-4 py-1.5 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition-colors"
          >
            업로드
          </button>
          <button className="px-4 py-1.5 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors">
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorArea;
