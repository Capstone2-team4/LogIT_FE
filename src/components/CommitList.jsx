// src/components/CommitList.jsx

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import API from "../config";

const CommitList = ({ setClickedCommitId }) => {
  // Dropdown state
  const [owners, setOwners] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [branches, setBranches] = useState([]);

  const [selectedOwner, setSelectedOwner] = useState("Owner");
  const [selectedRepo, setSelectedRepo] = useState("Repository");
  const [selectedBranch, setSelectedBranch] = useState("Branch");

  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  // Commit list state
  const [commits, setCommits] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  // Checkbox (radio) state: "commit" or "error"
  const [filter, setFilter] = useState("commit"); // default to "commit"

  // Fetch owners on mount
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

  // When an owner is selected, reset repo/branch and fetch repos
  const selectOwner = async (owner) => {
    setSelectedOwner(owner.name);
    setIsOwnerDropdownOpen(false);

    setSelectedRepo("Repository");
    setRepositories([]);
    setSelectedBranch("Branch");
    setBranches([]);
    setCommits([]);
    setVisibleCount(5);

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

  // When a repo is selected, reset branch and fetch branches
  const selectRepo = async (repo) => {
    setSelectedRepo(repo);
    setIsRepoDropdownOpen(false);

    setSelectedBranch("Branch");
    setBranches([]);
    setCommits([]);
    setVisibleCount(5);

    try {
      const accessToken = localStorage.getItem("accessToken");
      const config = { headers: { Authorization: `Bearer ${accessToken}` } };
      const res = await axios.get(
        API.GET_BRANCHES(selectedOwner, repo),
        config
      );
      const branchNames = res.data.result.map((b) => b.branchName || b.name);
      setBranches(branchNames);
    } catch (err) {
      console.error("🔴 Branch fetch error:", err);
    }
  };

  // When a branch is selected
  const selectBranch = (branch) => {
    setSelectedBranch(branch);
    setIsBranchDropdownOpen(false);

    setCommits([]);
    setVisibleCount(5);
  };

  // On confirm, fetch commits for owner/repo/branch
  const fetchCommits = async () => {
    if (
      selectedOwner === "Owner" ||
      selectedRepo === "Repository" ||
      selectedBranch === "Branch"
    ) {
      alert("Owner, Repository, Branch를 모두 선택하세요.");
      return;
    }
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(
        API.COMMITS(selectedOwner, selectedRepo, selectedBranch),
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setCommits(res.data.result || []);
      setVisibleCount(5);
    } catch (err) {
      console.error("🔴 Commit fetch error:", err);
      setCommits([]);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, commits.length));
  };

  return (
    <div className="mt-4 w-full">
      {/* ── Dropdowns + Confirm Button ── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Owner Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOwnerDropdownOpen((prev) => !prev)}
            className="px-2 py-1 border rounded bg-white text-xs hover:bg-gray-50 flex items-center gap-1"
          >
            <span className="font-semibold">{selectedOwner}</span>
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

        {/* Repo Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRepoDropdownOpen((prev) => !prev)}
            className="px-2 py-1 border rounded bg-white text-xs hover:bg-gray-50 flex items-center gap-1"
          >
            <span className="font-semibold">{selectedRepo}</span>
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

        {/* Branch Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsBranchDropdownOpen((prev) => !prev)}
            className="px-2 py-1 border rounded bg-white text-xs hover:bg-gray-50 flex items-center gap-1"
          >
            <span className="font-semibold">{selectedBranch}</span>
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
              {branches.map((branch) => (
                <div
                  key={branch}
                  onClick={() => selectBranch(branch)}
                  className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {branch}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirm Button */}
        <button
          onClick={fetchCommits}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
        >
          확인
        </button>
      </div>

      {/* ── Filter Radios ── */}
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-1 text-sm cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="commit"
            checked={filter === "commit"}
            onChange={() => setFilter("commit")}
            className="form-radio text-blue-600"
          />
          <span>커밋</span>
        </label>
        <label className="flex items-center gap-1 text-sm cursor-pointer">
          <input
            type="radio"
            name="filter"
            value="error"
            checked={filter === "error"}
            onChange={() => setFilter("error")}
            className="form-radio text-blue-600"
          />
          <span>에러</span>
        </label>
      </div>

      {/* ── Commit List ── */}
      <div className="flex flex-col space-y-2">
        {commits.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">
            선택하신 브랜치에 커밋이 없습니다.
          </div>
        ) : (
          commits.slice(0, visibleCount).map((commit) => (
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
          ))
        )}
      </div>

      {/* ── Show More Button ── */}
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
