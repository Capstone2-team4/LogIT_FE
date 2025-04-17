import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

import axios from "axios";
import API from "../config";
import { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import "./editor.css";

const EditorArea = ({ setPosts, onUploadSuccess }) => {
  const [editorTitle, setEditorTitle] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
      TaskList,
      TaskItem,
      Image,
      Youtube.configure({ width: 640, height: 360 }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none editor-wrapper",
      },
    },
    content: "",
  });

  useEffect(() => {
    if (!editor) return;

    const autosave = debounce(() => {
      const content = editor.getHTML();
      localStorage.setItem("draft", content);
    }, 1000);

    editor.on("update", autosave);

    const saved = localStorage.getItem("draft");
    if (saved) editor.commands.setContent(saved);

    return () => editor.off("update", autosave);
  }, [editor]);

  const handleUpload = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!editor) return;
    const htmlContent = editor.getHTML();

    try {
      const response = await axios.post(
        API.CREATE_RECORD,
        {
          title: editorTitle,
          content: htmlContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert("업로드 완료!");
      const backendPost = response.data.result;
      const transformed = transformPostData(backendPost);
      setPosts((prev) => [transformed, ...prev]);
      onUploadSuccess?.();

      setEditorTitle("");
      editor.commands.setContent("");
      localStorage.removeItem("draft");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패! 서버 확인 필요.");
    }
  };

  const transformPostData = (post) => ({
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
  });

  return (
    <div className="h-screen flex-1 max-w-3xl py-10">
      <div className="border rounded-md h-full flex flex-col">
        <div className="border-b p-3">
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-2xl font-bold focus:outline-none"
          />
        </div>

        <div className="flex-1 p-3 overflow-y-auto">
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <p className="text-gray-400">에디터 로딩 중...</p>
          )}
        </div>

        <div className="border-t p-3 flex justify-end gap-2">
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
