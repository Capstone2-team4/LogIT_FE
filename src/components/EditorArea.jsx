import React, { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { codeBlock } from "@blocknote/code-block";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import axios from "axios";
import API from "../config";
import debounce from "lodash.debounce";
import "./editor.css";

const EditorArea = ({ setPosts, onUploadSuccess }) => {
  const [editorTitle, setEditorTitle] = useState("");
  const editor = useCreateBlockNote({
    codeBlock,
  });

  // Auto-save and load draft
  useEffect(() => {
    if (!editor) return;
    const autosave = debounce(() => {
      if (editor.commands?.getHTML) {
        localStorage.setItem("draft", editor.getHTML());
      }
    }, 1000);

    editor.on("transaction", autosave);

    const saved = localStorage.getItem("draft");
    if (saved && editor.commands?.setHTML) {
      editor.commands.setHTML(saved);
    }

    return () => editor.off("transaction", autosave);
  }, [editor]);

  const handleUpload = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!editor) return;

    const htmlContent = editor.getHTML();
    try {
      const response = await axios.post(
        API.CREATE_RECORD,
        { title: editorTitle, content: htmlContent },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      alert("업로드 완료!");
      const backendPost = response.data.result;
      const transformed = {
        id: backendPost.recordId,
        title: backendPost.title,
        author: backendPost.author,
        preview: [backendPost.content],
        date: new Date(backendPost.createdAt).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        tags: [],
      };

      setPosts((prev) => [transformed, ...prev]);
      onUploadSuccess?.();
      setEditorTitle("");
      editor.commands.clearContent();
      localStorage.removeItem("draft");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패! 서버 확인 필요.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center py-6">
      <div className="w-full max-w-6xl border rounded-md flex flex-col h-full">
        <div className="border-b p-4">
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-2xl font-bold focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto w-full p-4">
          {editor ? (
            <BlockNoteView
              editor={editor}
              className="bn-editor editor-wrapper w-full h-full"
              style={{ minHeight: "600px", width: "100%" }}
            />
          ) : (
            <p className="text-gray-400">에디터 로딩 중...</p>
          )}
        </div>

        <div className="border-t p-4 flex justify-end gap-2">
          <button
            onClick={handleUpload}
            className="px-4 py-1.5 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorArea;
