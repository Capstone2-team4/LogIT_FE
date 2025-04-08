import { useState } from "react";
import { Link } from "react-router-dom";

const CodeList = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "에러", "백준풀이", "캡스톤프로젝트"];
  const codeItems = [
    { id: "1", title: "code1" },
    { id: "2", title: "code2" },
    { id: "3", title: "code3" },
  ];

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
  };

  return (
    <div className="mt-8 w-full">
      <div className="flex items-center justify-between mb-2 relative">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm">추가한 코드</span>
        </div>

        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 hover:bg-gray-50 rounded cursor-pointer transition-colors px-2 py-1 border text-xs"
          >
            {selectedCategory}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border rounded shadow z-10">
              {categories.map((category) => (
                <div
                  key={category}
                  onClick={() => selectCategory(category)}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {codeItems.map((item) => (
          <Link
            key={item.id}
            to="#"
            className="text-blue-500 hover:underline text-sm py-0.5"
          >
            {item.title}
          </Link>
        ))}
      </div>

      <div className="mt-1 text-right">
        <span className="text-xs text-green-600 cursor-pointer hover:underline">
          See the full list
        </span>
      </div>
    </div>
  );
};

export default CodeList;
