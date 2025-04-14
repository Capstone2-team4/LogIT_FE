import { Link } from "react-router-dom";
import { Home, GitCommitHorizontal, Ban, User } from "lucide-react";
import logo from "../assets/LogIT_Logo.png"; // 로고 이미지
import githubLogo from "../assets/github-mark.png"; // 로고 이미지

const LeftSidebar = ({ onNavigate, currentView }) => {
  const handleRegisterGithub = () => {
    console.log("🔐 GitHub 로그인 시도!");
    const githubAuthUrl = "http://localhost:8080/oauth2/authorization/github";

    window.location.href = githubAuthUrl;
  };

  return (
    <div className="w-14 border-r flex flex-col items-center">
      <div className="py-4 border-b w-full flex justify-center">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="LogIT Logo"
            className="w-15 h-15 object-contain"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center pt-6 gap-6">
        {/* currentView 값이 "home"이면 활성화 표시를 위해 배경색을 변경 */}
        <button
          onClick={() => onNavigate("home")}
          className={`p-2 rounded-md ${
            currentView === "home" ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <Home className="w-5 h-5" />
        </button>
        <Link to="#" className="p-2 rounded-md hover:bg-gray-100">
          <GitCommitHorizontal className="w-5 h-5" />
        </Link>
        <Link to="#" className="p-2 rounded-md hover:bg-gray-100">
          <Ban className="w-5 h-5" />
        </Link>
      </div>

      <div className="github-logo-container">
        <img
          src={githubLogo}
          alt="Github Logo"
          className="github-logo"
          style={{ width: "36px", height: "36px", cursor: "pointer" }}
          onClick={handleRegisterGithub}
        />
      </div>

      <div className="py-6 flex justify-center">
        <Link
          to="#"
          className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <User className="w-5 h-5 text-white" />
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
