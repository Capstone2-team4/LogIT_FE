import React, { useState } from "react";
import axios from "axios";
import API from "../config";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodeBlockCard = ({ block, onDelete }) => {
  const [open, setOpen] = useState(false);
  const { id, title, filePath, category, content, code, createdAt } = block;
  const fileName = filePath.split(/\\|\//).pop();

  const date = new Date(createdAt);
  const formattedAt = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("코드블럭을 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(API.DELETE_CODE_BLOCK(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 부모 콜백으로 삭제됐다고 알림
      onDelete(id);
    } catch (err) {
      console.error("❌ 코드블럭 삭제 실패:", err);
    }
  };

  return (
    <div className="border rounded-md mb-2">
      <div
        className="flex items-center justify-between p-2 bg-gray-100 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-2">
          <svg
            className={`w-4 h-4 transform transition-transform ${
              open ? "rotate-90" : ""
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
          </svg>
          <span className="font-medium text-sm">{title || fileName}</span>
          <span className="text-gray-400 text-xs ml-2">{formattedAt}</span>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 text-xs hover:underline"
        >
          삭제
        </button>
      </div>

      {open && (
        <div className="p-2">
          <p className="text-xs text-gray-600 mb-1">
            <strong>Category:</strong> {category}
          </p>
          {content && (
            <p className="text-xs text-gray-800 mb-2 whitespace-pre-wrap">
              {content}
            </p>
          )}
          <SyntaxHighlighter
            language="java"
            style={github}
            customStyle={{
              fontSize: "12px",
              borderRadius: "4px",
              padding: "8px",
            }}
            wrapLines
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default CodeBlockCard;
