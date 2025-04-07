import { Link } from "react-router-dom";
import { Home, Bell, FileText, User } from "lucide-react";

const LeftSidebar = () => {
  return (
    <div className="w-14 border-r flex flex-col items-center">
      <div className="py-4 border-b w-full flex justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <rect
                x="2"
                y="4"
                width="20"
                height="16"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M8 10h8M8 14h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs font-bold mt-1">LogIT</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center pt-6 gap-6">
        <Link to="#" className="p-2 rounded-md hover:bg-gray-100">
          <Home className="w-5 h-5" />
        </Link>
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
