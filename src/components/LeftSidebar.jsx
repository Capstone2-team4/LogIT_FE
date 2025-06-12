import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Home, GitCommitHorizontal, Ban, User } from "lucide-react";
import logo from "../assets/LogIT_Logo.png";
import githubLogo from "../assets/github-mark.png";

const LeftSidebar = ({ onNavigate, currentView }) => {
  const navigate = useNavigate();
  const handleRegisterGithub = () => {
    console.log("🔐 GitHub 로그인 시도!");
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  const handleMainClick = () => {
    navigate("/main");
  };

  return (
    <div className="w-14 flex flex-col justify-between items-center h-full py-4">
      {/* ─── 상단 그룹: 로고 + 네비게이션 버튼들 ─── */}
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="border-b w-full flex justify-center pb-4">
          <img
            src={logo}
            onClick={handleMainClick}
            alt="LogIT Logo"
            className="w-12 h-12 object-contain cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>
        {/* Nav 버튼들 */}
        <button
          onClick={handleMainClick}
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

      {/* ─── 하단 그룹: GitHub 로그인 + 프로필 버튼 ─── */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={githubLogo}
          alt="Github Logo"
          className="w-8 h-8 cursor-pointer"
          onClick={handleRegisterGithub}
        />
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
