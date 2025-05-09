"use client";
import BlogPostCard from "./BlogPostCard";
import { Edit } from "lucide-react";

const BlogPostList = ({ posts, onNewPost }) => {
  return (
    <div
      className="flex-1 relative"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // 🟢 최상단 기준 높이 확정
      }}
    >
      <div
        className="blogPostList-container"
        style={{
          overflowY: "auto",
        }}
      >
        <div className="max-w-3xl mx-auto overflow-auto h-full py-4">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Floating Write Button */}
        <button
          onClick={onNewPost}
          className="absolute bottom-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
        >
          <Edit className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default BlogPostList;
