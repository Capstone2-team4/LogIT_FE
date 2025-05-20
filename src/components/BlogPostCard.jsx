// src/components/BlogPostCard.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import axios from "axios";
import API from "../config";

const BlogPostCard = ({ post, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // 삭제
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(API.DELETE_RECORD(post.id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted?.(post.id);
    } catch (err) {
      alert("삭제 실패: " + (err.response?.data?.message || err.message));
    } finally {
      setOpen(false);
    }
  };

  // 상세 페이지로 이동
  const goDetail = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div
      className="bg-indigo-50 rounded-xl p-4 w-full cursor-pointer hover:shadow-md transition"
      onClick={goDetail} // 카드 전체 클릭해도 상세로
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">📒</span>
        </div>
        <div
          ref={menuRef}
          className="relative"
          onClick={(e) => e.stopPropagation()} // 메뉴 클릭 시 상세로 이동 방지
        >
          <button
            className="p-1 rounded-full hover:bg-gray-200"
            onClick={() => setOpen((o) => !o)}
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-28 bg-white border rounded-md shadow-lg z-10">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={() => {
                  navigate(`/records/edit/${post.id}`);
                  setOpen(false);
                }}
              >
                수정
              </button>
              <button
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">
        {post.title || "Untitled"}
      </h2>
      <p className="text-sm text-gray-600">
        {post.date} · {post.tags?.length || 0}개
      </p>
    </div>
  );
};

export default BlogPostCard;
