import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { codeBlock } from "@blocknote/code-block";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import axios from "axios";
import API from "../config";
import debounce from "lodash.debounce";
import AISummaryModal from "../components/AISummaryModal";
import "./editor.css";

const EditorArea = ({ setPosts, onUploadSuccess }) => {
  const navigate = useNavigate();
  const [editorTitle, setEditorTitle] = useState("");
  const editor = useCreateBlockNote({ codeBlock });
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // 드래프트 자동 저장
  useEffect(() => {
    if (!editor) return;

    const autosave = debounce(() => {
      if (editor.commands?.getHTML) {
        localStorage.setItem("draft", editor.getHTML());
      }
    }, 1000);

    editor.on("transaction", autosave);

    // 페이지 로드 시 저장된 드래프트 불러오기
    const saved = localStorage.getItem("draft");
    if (saved && editor.commands?.setHTML) {
      editor.commands.setHTML(saved);
    }

    return () => editor.off("transaction", autosave);
  }, [editor]);

  // 글 업로드
  const handleUpload = async () => {
    const token = localStorage.getItem("accessToken");
    if (!editor) return;

    try {
      const html = await editor.blocksToFullHTML(editor.document);
      const res = await axios.post(
        API.CREATE_RECORD,
        { title: editorTitle, content: html },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("업로드 완료!");

      // 메인 화면으로 이동
      setTimeout(() => {
        navigate("/main"); // 메인 페이지로 이동
      }, 500);

      // 게시글 목록에 새 글 추가
      const post = res.data.result;
      setPosts((prev) => [
        {
          id: post.recordId,
          title: post.title,
          author: post.author,
          preview: [post.content],
          date: new Date(post.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          tags: [],
        },
        ...prev,
      ]);

      onUploadSuccess?.();
    } catch (err) {
      console.error(err);
    }
  };

  // AI 요약 완료 시 에디터에 삽입
  const handleSummaryComplete = async (summary) => {
    try {
      if (!editor || !summary) return;

      // 마크다운을 블록으로 변환하여 에디터에 삽입
      const blocks = await editor.tryParseMarkdownToBlocks(summary);
      editor.insertBlocks(
        blocks,
        editor.document[editor.document.length - 1],
        "after"
      );

      editor.focus();
    } catch (err) {
      console.error("요약 내용 삽입 실패:", err);
      alert("요약 내용을 에디터에 삽입하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center">
      {/* 에디터 */}
      <div className="w-full max-w-6xl rounded-md flex flex-col h-full">
        {/* 제목 입력 */}
        <div className="border-b p-4">
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-2xl font-bold focus:outline-none"
          />
        </div>

        {/* 에디터 영역 */}
        <div className="flex-1 overflow-y-auto w-full p-4">
          {editor ? (
            <BlockNoteView
              editor={editor}
              className="bn-editor editor-wrapper w-full h-full"
              style={{ minHeight: "600px" }}
            />
          ) : (
            <p className="text-gray-400">에디터 로딩 중...</p>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="border-t p-4 flex justify-end gap-2">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
          >
            AI 요약✨
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-1.5 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
          >
            업로드
          </button>
        </div>
      </div>

      {/* AI 요약 모달 */}
      <AISummaryModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSummaryComplete={handleSummaryComplete}
      />
    </div>
  );
};

export default EditorArea;
