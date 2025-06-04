// src/pages/EditorPage.jsx

import { useState } from "react";
import OwnerRepoSelectModal from "../components/OwnerRepoSelectModal";
import CommitList from "../components/CommitList";
import FileList from "../components/FileList";
import CodePreviewBox from "../components/CodePreviewBox";
import EditorArea from "../components/EditorArea";
import axios from "axios";
import API from "../config";

const EditorPage = () => {
  // 모달 보이기/숨기기 상태
  const [isModalOpen, setIsModalOpen] = useState(true);

  // 모달에서 선택된 owner/repo/branch
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  // (branch는 API 호출 시점에만 쓰고, 이후 화면에서는 필요 없으므로 별도 상태로 저장하지 않음)
  //   const [selectedBranch, setSelectedBranch] = useState(null);

  // 모달 확인 시 받아올 커밋 목록 배열
  const [commits, setCommits] = useState([]);

  // 유저가 Commit 중 하나를 클릭하면 해당 커밋 ID가 이곳으로 넘어옴
  const [clickedCommitId, setClickedCommitId] = useState(null);

  // “모달에서 확인” 버튼이 눌렸을 때 호출되는 함수
  const handleModalConfirm = async (owner, repo, branch) => {
    setIsModalOpen(false);

    // 선택된 owner/repo를 상태로 저장
    setSelectedOwner(owner);
    setSelectedRepo(repo);

    // 해당 API 호출 → 커밋 목록을 fetch
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await axios.get(API.COMMITS(owner, repo, branch), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      // 받아온 데이터를 commits 상태에 저장
      setCommits(res.data.result || []);
    } catch (err) {
      console.error("🔴 Commit fetch error in handleModalConfirm:", err);
      setCommits([]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] m-4 gap-4">
      {/* 모달이 열려있는 동안 Owner/Repo/Branch 선택 */}
      {isModalOpen && (
        <OwnerRepoSelectModal
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      )}

      {/* 모달이 닫힌 뒤에만 화면을 렌더 */}
      {!isModalOpen && (
        <>
          {/* 왼쪽: CommitList + FileList */}
          <div className="w-[25%] flex flex-col">
            {/* CommitList: prop으로 받은 commits 배열을 렌더 */}
            <div className="flex-1 overflow-auto">
              <CommitList
                commits={commits}
                setClickedCommitId={setClickedCommitId}
              />
            </div>

            {/* FileList: 클릭된 커밋 ID를 prop으로 넘겨서 파일 목록을 렌더 */}
            <div className="flex-1 overflow-auto">
              <FileList
                selectedOwner={selectedOwner}
                selectedRepo={selectedRepo}
                commitId={clickedCommitId}
              />
            </div>
          </div>

          {/* 가운데: CodePreviewBox */}
          <div className="w-[35%] overflow-auto">
            <CodePreviewBox commitId={clickedCommitId} />
          </div>

          {/* 오른쪽: EditorArea */}
          <div className="w-[40%] overflow-auto">
            <EditorArea
              selectedOwner={selectedOwner}
              selectedRepo={selectedRepo}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EditorPage;
