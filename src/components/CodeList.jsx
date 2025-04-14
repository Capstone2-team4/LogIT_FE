import { useState , useEffect} from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CodeList = () => {
  // Owner, Repository 드롭다운 상태 및 선택값
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState("Owner");
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("Repository");

  const [owners, setOwners] = useState([]);
  const [repositories, setRepositories] = useState([]);

  // 🔸 Owner 목록 불러오기 (개인 + 조직)
  useEffect(() => {
    const fetchOwners = async () => {
      try {

        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const userRes = await axios.get("http://localhost:8080/githubs/users/repos", config);
        const orgRes = await axios.get("http://localhost:8080/githubs/users/org", config);

        const userOwner = { name: userRes.data.result.ownerName, type: "user" };
        const orgOwners = orgRes.data.result.map((org) => ({
          name: org.orgName,
          type: "org",
        }));

        setOwners([userOwner, ...orgOwners]);
      } catch (err) {
        console.error("Owner fetch error:", err);
      }
    };

    fetchOwners();
  }, []);

  // 🔸 특정 Owner 선택 시 해당 Repository 목록 불러오기
  const selectOwner = async (owner) => {
    setSelectedOwner(owner.name);
    setIsOwnerDropdownOpen(false);
    setSelectedRepo("Repository");
    try {

      const accessToken = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

      const url =
        owner.type === "user"
          ? `http://localhost:8080/githubs/users/repos`
          : `http://localhost:8080/githubs/users/${owner.name}/repos`;

      const res = await axios.get(url, config);
      const repoNames = res.data.result.repoList.map((r) => r.repoName);
      setRepositories(repoNames);
    } catch (err) {
      console.error("Repository fetch error:", err);
    }
  };

  
  const toggleOwnerDropdown = () => setIsOwnerDropdownOpen((prev) => !prev);
  const toggleRepoDropdown = () => setIsRepoDropdownOpen((prev) => !prev);


  const selectRepo = (repo) => {
    setSelectedRepo(repo);
    setIsRepoDropdownOpen(false);
  };

  // 기존 카테고리 드롭다운 (커밋한 코드 관련)
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
      {/* Owner / Repository 드롭다운 영역 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Owner 드롭다운 */}
          <div className="relative">
            <button
              onClick={toggleOwnerDropdown}
              className="flex items-center gap-1 hover:bg-gray-50 rounded cursor-pointer transition-colors px-2 py-1 border text-xs"
            >
              <span className="font-bold">{selectedOwner}</span>
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
            {isOwnerDropdownOpen && (
              <div className="absolute left-0 mt-1 min-w-max bg-white border rounded shadow z-10">
                {owners.map((owner) => (
                  <div
                    key={owner.name}
                    onClick={() => selectOwner(owner)}
                    className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {owner.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <span>/</span>
          {/* Repository 드롭다운 */}
          <div className="relative">
            <button
              onClick={toggleRepoDropdown}
              className="flex items-center gap-1 hover:bg-gray-50 rounded cursor-pointer transition-colors px-2 py-1 border text-xs"
            >
              <span className="font-bold">{selectedRepo}</span>
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
            {isRepoDropdownOpen && (
              <div className="absolute left-0 mt-1 min-w-max bg-white border rounded shadow z-10">
                {repositories.map((repo) => (
                  <div
                    key={repo}
                    onClick={() => selectRepo(repo)}
                    className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                  >
                    {repo}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2 relative">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm">커밋 코드</span>
        </div>

        {/* 카테고리 드롭다운, 나중에 정보는 백엔드에서 받아오기 */}
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

      <div className="flex flex-col space-y-2">
        {codeItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <Link to="#" className="text-blue-500 hover:underline text-sm">
              {item.title}
            </Link>
            <Link to="#" className="text-green-600 hover:underline text-xs">
              관련커밋
            </Link>
          </div>
        ))}
      </div>

      {/* 전체 목록 보기 */}
      <div className="mt-1 text-right">
        <span className="text-xs text-red-600 cursor-pointer hover:underline">
          See the full list
        </span>
      </div>
    </div>
  );
};

export default CodeList;
