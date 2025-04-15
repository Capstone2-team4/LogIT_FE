import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import API from "../config";

const CommitList = ({
  selectedOwner,
  setSelectedOwner,
  selectedRepo,
  setSelectedRepo,
  setClickedCommitId,
}) => {
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [owners, setOwners] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [commits, setCommits] = useState([]);

  const [visibleCount, setVisibleCount] = useState(5); // 🔸 보여줄 커밋 수
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "에러", "백준풀이", "캡스톤프로젝트"];

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = { headers: { Authorization: `Bearer ${accessToken}` } };
        const userRes = await axios.get(API.USER_REPOS, config);
        const orgRes = await axios.get(API.ORG_LIST, config);

        const userOwner = { name: userRes.data.result.ownerName, type: "user" };
        const orgOwners = orgRes.data.result.map((org) => ({
          name: org.orgName,
          type: "org",
        }));

        setOwners([userOwner, ...orgOwners]);
      } catch (err) {
        console.error("🔴 Owner fetch error:", err);
      }
    };

    fetchOwners();
  }, []);

  const selectOwner = async (owner) => {
    setSelectedOwner(owner.name);
    setIsOwnerDropdownOpen(false);
    setSelectedRepo("Repository");

    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      const url =
        owner.type === "user" ? API.USER_REPOS : API.ORG_REPOS(owner.name);
      const res = await axios.get(url, config);
      const repoNames = res.data.result.repoList.map((r) => r.repoName);
      setRepositories(repoNames);
    } catch (err) {
      console.error("🔴 Repository fetch error:", err);
    }
  };

  const selectRepo = (repo) => {
    setSelectedRepo(repo);
    setIsRepoDropdownOpen(false);
  };

  const fetchCommits = async () => {
    if (selectedOwner === "Owner" || selectedRepo === "Repository") {
      alert("Owner와 Repository를 모두 선택하세요.");
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };

      const url = API.COMMITS(selectedOwner, selectedRepo);
      const res = await axios.get(url, config);
      setCommits(res.data.result);
      setVisibleCount(5); // 🔸 새로 불러올 때는 최대 5개만 보여줌
    } catch (err) {
      console.error("🔴 Commit fetch error:", err);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, commits.length));
  };

  return (
    <div className="mt-4 w-full">
      {/* Owner / Repository 드롭다운 + 확인 버튼 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Owner 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsOwnerDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:bg-gray-50 rounded cursor-pointer transition-colors px-2 py-1 border text-xs"
            >
              <span className="font-bold">{selectedOwner || "Owner"}</span>
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

          {/* Repo 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => setIsRepoDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 hover:bg-gray-50 rounded cursor-pointer transition-colors px-2 py-1 border text-xs"
            >
              <span className="font-bold">{selectedRepo || "Repository"}</span>
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

          {/* 확인 버튼 */}
          <button
            onClick={fetchCommits}
            className="ml-2 px-2 py-1 border text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            확인
          </button>
        </div>
      </div>

      {/* 커밋 카테고리 필터 */}
      <div className="flex items-center justify-between mb-2 relative">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold mb-2">🖥️ 커밋 코드</span>
          <span className="text-xs text-gray-500 mb-2">
            ({Math.min(visibleCount, commits.length)}/{commits.length})
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
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
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsDropdownOpen(false);
                  }}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 커밋 리스트 (최대 visibleCount 개), 디폴트 5개 */}
      <div className="flex flex-col space-y-2">
        {commits.slice(0, visibleCount).map((commit) => (
          <div
            key={commit.id}
            className="flex items-center justify-between border-b pb-1"
          >
            <button
              onClick={() => setClickedCommitId(commit.id)}
              className="text-left text-sm text-blue-600 underline hover:text-blue-800"
            >
              {commit.message.length > 30
                ? `${commit.message.slice(0, 30)}...`
                : commit.message}
            </button>
            <span className="text-xs text-gray-500">
              {dayjs(commit.date).format("YYYY-MM-DD HH:mm")}
            </span>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {visibleCount < commits.length && (
        <div className="mt-3 text-center">
          <button
            onClick={handleShowMore}
            className="text-xs text-green-500 hover:underline"
          >
            See more commits
          </button>
        </div>
      )}
    </div>
  );
};

export default CommitList;
