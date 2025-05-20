// src/components/BlogPostList.jsx
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogPostCard from "./BlogPostCard";
import API from "../config"; // API.GET_RECORD_LIST 가 설정되어 있다고 가정

const BlogPostList = ({ onDeleted, onCardClick }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(API.GET_RECORD_LIST, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // 백엔드 DTO → 프론트용 포맷으로 변환
        const list = res.data.result.getRecordResultDTOList.map((p) => ({
          id: p.recordId,
          title: p.title,
          content: p.content,
          author: p.author,
          createdAt: p.createdAt,
          tags: p.tags || [],
        }));
        setPosts(list);
      } catch (err) {
        console.error("게시글 로드 실패:", err);
      }
    };

    fetchPosts();
    const intervalId = setInterval(fetchPosts, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          post={post}
          onDeleted={() => onDeleted(post.id)}
          onClick={() => onCardClick(post)}
        />
      ))}
    </div>
  );
};

export default BlogPostList;
