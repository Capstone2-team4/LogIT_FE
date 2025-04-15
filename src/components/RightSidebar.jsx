import { useState } from "react";
import CodePreviewBox from "./CodePreviewBox";
import CommitList from "./CommitList";
import FileList from "./FileList";

const RightSidebar = () => {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [clickedCommitId, setClickedCommitId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null); // ✅ 선택된 파일 정보 (파일명 + patch)

  return (
    <div className="w-full flex-1 flex-col gap-4 relative py-10 overflow-y-auto max-h-screen px-2">
      {/* 🔹 위쪽 코드 미리보기 박스 */}
      <CodePreviewBox file={previewFile} />

      {/* 🔹 아래쪽 영역 - 좌측: 커밋 목록 / 우측: 파일 목록 */}
      <div className="flex">
        {/* 커밋 리스트 영역 */}
        <div className="w-1/2 pr-2">
          <CommitList
            selectedOwner={selectedOwner}
            setSelectedOwner={(owner) => {
              setSelectedOwner(owner);
              setClickedCommitId(null); // ✅ 오너 바뀌면 커밋 및 파일 초기화
              setPreviewFile(null);
            }}
            selectedRepo={selectedRepo}
            setSelectedRepo={(repo) => {
              setSelectedRepo(repo);
              setClickedCommitId(null); // ✅ 레포 바뀌면 커밋 및 파일 초기화
              setPreviewFile(null);
            }}
            setClickedCommitId={setClickedCommitId}
          />
        </div>

        {/* 파일 리스트 영역 */}
        <div className="w-1/2 pl-2">
          {selectedOwner && selectedRepo && clickedCommitId && (
            <FileList
              owner={selectedOwner}
              repo={selectedRepo}
              commitId={clickedCommitId}
              onFileClick={(file) => setPreviewFile(file)} // ✅ patch 전달
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
