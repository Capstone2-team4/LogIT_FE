import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import API from "../config";

const CommitList = ({
  selectedOwner,
  selectedRepo,
  selectedBranch,
  setParentOwner,
  setParentRepo,
  setParentBranch,
  setClickedCommitId,
}) => {
  // Dropdown data
  const [owners, setOwners] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);

  // Local selection state
  const [owner, setOwner] = useState(selectedOwner || "Owner");
  const [repo, setRepo] = useState(selectedRepo || "Repository");
  const [branch, setBranch] = useState(selectedBranch || "Branch");

  // Toggles
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // Commits list
  const [commits, setCommits] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  // Fetch owners once
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };
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

  // Handlers
  const selectOwner = async (o) => {
    setOwner(o.name);
    setParentOwner(o.name);
    setIsOwnerDropdownOpen(false);

    // reset downstream
    setRepo("Repository");
    setParentRepo(null);
    setRepositories([]);
    setBranch("Branch");
    setParentBranch(null);
    setBranches([]);
    setCommits([]);
    setVisibleCount(5);

    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const url = o.type === "user" ? API.USER_REPOS : API.ORG_REPOS(o.name);
      const res = await axios.get(url, config);
      const repoList = res.data.result.repoList.map((r) => r.repoName);
      setRepositories(repoList);
    } catch (err) {
      console.error("🔴 Repository fetch error:", err);
    }
  };

  const selectRepo = async (r) => {
    setRepo(r);
    setParentRepo(r);
    setIsRepoDropdownOpen(false);

    // reset below
    setBranch("Branch");
    setParentBranch(null);
    setBranches([]);
    setCommits([]);
    setVisibleCount(5);

    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API.GET_BRANCHES(owner, r), config);
      const branchNames = res.data.result.map((b) => b.branchName || b.name);
      setBranches(branchNames);
    } catch (err) {
      console.error("🔴 Branch fetch error:", err);
    }
  };

  const selectBranch = (b) => {
    setBranch(b);
    setParentBranch(b);
    setIsBranchDropdownOpen(false);

    // clear commits
    setCommits([]);
    setVisibleCount(5);
  };

  const fetchCommits = async () => {
    if (owner === "Owner" || repo === "Repository" || branch === "Branch") {
      alert("Owner, Repository, Branch를 모두 선택하세요.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(API.COMMITS(owner, repo, branch), config);

      // 날짜순으로 최신순 정렬 (내림차순)
      const sortedCommits = (res.data.result || []).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // 최신순 (내림차순)
      });

      setCommits(sortedCommits);
      setVisibleCount(5);
    } catch (err) {
      console.error("🔴 Commit fetch error:", err);
      setCommits([]);
    }
  };

  const handleShowMore = () =>
    setVisibleCount((prev) => Math.min(prev + 5, commits.length));

  return (
    <div className="mt-4 w-full">
      {/* Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Owner */}
        <div className="relative">
          <button
            onClick={() => setIsOwnerDropdownOpen((p) => !p)}
            className="px-2 py-1 border rounded bg-white text-xs hover:bg-gray-50 flex items-center gap-1"
          >
            <span className="font-semibold">{owner}</span>
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
            <div className="absolute left-0 mt-1 w-40 bg-white border rounded shadow z-10 max-h-48 overflow-y-auto">
              {owners.map((o) => (
                <div
                  key={o.name}
                  onClick={() => selectOwner(o)}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {o.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Repo */}
        <div className="relative">
          <button
            onClick={() => setIsRepoDropdownOpen((p) => !p)}
            className="px-2 py-1 border rounded bg-white text-xs hover:bg-gray-50 flex items-center gap-1"
          >
            <span className="font-semibold">{repo}</span>
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
            <div className="absolute left-0 mt-1 w-40 bg-white border rounded shadow z-10 max-h-48 overflow-y-auto">
              {repositories.map((rName) => (
                <div
                  key={rName}
                  onClick={() => selectRepo(rName)}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {rName}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Branch */}
        <div className="relative">
          <button
            onClick={() => setIsBranchDropdownOpen((p) => !p)}
            className="px-2 py-1 border rounded bg-white text-xs hover:bg-gray-50 flex items-center gap-1"
          >
            <span className="font-semibold">{branch}</span>
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
          {isBranchDropdownOpen && (
            <div className="absolute left-0 mt-1 w-40 bg-white border rounded shadow z-10 max-h-48 overflow-y-auto">
              {branches.map((bName) => (
                <div
                  key={bName}
                  onClick={() => selectBranch(bName)}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {bName}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={fetchCommits}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          확인
        </button>
      </div>

      {/* Commits */}
      <div className="flex flex-col space-y-2">
        {commits.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">
            선택하신 브랜치에 커밋이 없습니다.
          </div>
        ) : (
          <>
            {/* 정렬 정보 표시 */}
            <div className="text-xs text-gray-400 mb-2">
              총 {commits.length}개 커밋 (최신순)
            </div>
            {commits.slice(0, visibleCount).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between border-b pb-1"
              >
                <button
                  onClick={() => setClickedCommitId(c.id, c.message)}
                  className="text-left text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {c.message.length > 30
                    ? `${c.message.slice(0, 30)}...`
                    : c.message}
                </button>
                <span className="text-xs text-gray-500">
                  {dayjs(c.date).format("YYYY-MM-DD HH:mm")}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
      {commits.length > visibleCount && (
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
