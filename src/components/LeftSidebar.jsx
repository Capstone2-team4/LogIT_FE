import { Link } from "react-router-dom";
import { Home, Bell, FileText, User } from "lucide-react";
import logo from "../assets/LogIT_Logo.png"; // 로고 이미지

const LeftSidebar = ({ onNavigate, currentView }) => {
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
          <Bell className="w-5 h-5" />
        </Link>
        <Link to="#" className="p-2 rounded-md hover:bg-gray-100">
          <FileText className="w-5 h-5" />
        </Link>
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
