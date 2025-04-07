import { useState } from "react";

const EditorArea = () => {
  const [editorContent, setEditorContent] = useState("");
  const [editorTitle, setEditorTitle] = useState("");

  return (
    <div className="flex-1 py-10">
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
          <button className="px-4 py-1.5 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition-colors">
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
