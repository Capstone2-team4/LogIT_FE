import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";

const OwnerRepoSelectModal = ({ onClose, onConfirm }) => {
  const [owners, setOwners] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("Owner");
  const [selectedRepo, setSelectedRepo] = useState("Repository");
  const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);

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

  const handleOwnerSelect = async (owner) => {
    setSelectedOwner(owner.name);
    setSelectedRepo("Repository");
    setIsOwnerDropdownOpen(false);

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

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setIsRepoDropdownOpen(false);
  };

  const handleConfirm = () => {
    if (selectedOwner === "Owner" || selectedRepo === "Repository") {
      alert("Owner와 Repository를 모두 선택하세요.");
      return;
    }
    onConfirm(selectedOwner, selectedRepo);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">저장소 선택</h2>

        {/* Owner 드롭다운 */}
        <div className="relative mb-3">
          <button
            onClick={() => setIsOwnerDropdownOpen((prev) => !prev)}
            className="w-full px-3 py-2 border rounded text-left"
          >
            {selectedOwner}
          </button>
          {isOwnerDropdownOpen && (
            <div className="absolute w-full bg-white border rounded shadow z-10 mt-1">
              {owners.map((owner) => (
                <div
                  key={owner.name}
                  onClick={() => handleOwnerSelect(owner)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {owner.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repo 드롭다운 */}
        <div className="relative mb-4">
          <button
            onClick={() => setIsRepoDropdownOpen((prev) => !prev)}
            className="w-full px-3 py-2 border rounded text-left"
          >
            {selectedRepo}
          </button>
          {isRepoDropdownOpen && (
            <div className="absolute w-full bg-white border rounded shadow z-10 mt-1">
              {repositories.map((repo) => (
                <div
                  key={repo}
                  onClick={() => handleRepoSelect(repo)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {repo}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-black"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerRepoSelectModal;
