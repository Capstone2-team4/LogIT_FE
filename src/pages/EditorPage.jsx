import React, { useState } from "react";
import CommitList from "../components/CommitList";
import FileList from "../components/FileList";
import CodePreviewBox from "../components/CodePreviewBox";
import EditorArea from "../components/EditorArea";

const EditorPage = () => {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [clickedCommitId, setClickedCommitId] = useState(null);

  // 선택된 파일/에러코드 정보
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [selectedErrorInfoId, setSelectedErrorInfoId] = useState(null);

  const handleFileClick = (payload) => {
    if (payload.filename) {
      setSelectedPayload({ file: payload });
      setSelectedErrorInfoId(null);
    } else if (payload.errorInfoId) {
      setSelectedErrorInfoId(payload.errorInfoId);
      setSelectedPayload(null);
    } else if (payload.errorCodeList) {
      setSelectedPayload({ errorCodeList: payload.errorCodeList });
      setSelectedErrorInfoId(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] m-4 gap-4">
      <div className="w-[25%] flex flex-col">
        <div className="flex-1 overflow-auto">
          <CommitList
            selectedOwner={selectedOwner}
            selectedRepo={selectedRepo}
            selectedBranch={selectedBranch}
            setParentOwner={setSelectedOwner}
            setParentRepo={setSelectedRepo}
            setParentBranch={setSelectedBranch}
            setClickedCommitId={setClickedCommitId}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <FileList
            owner={selectedOwner}
            repo={selectedRepo}
            commitId={clickedCommitId}
            onFileClick={handleFileClick}
          />
        </div>
      </div>

      {/* 중앙: 코드/에러 뷰 */}
      <div className="w-1/3 overflow-auto border rounded p-2">
        <CodePreviewBox
          file={selectedPayload?.file || null}
          errorInfoId={selectedErrorInfoId}
          errorCodeList={selectedPayload?.errorCodeList || null}
        />
      </div>

      {/* 우측: 에디터 */}
      <div className="w-5/12 overflow-auto border rounded p-2">
        <EditorArea
          selectedOwner={selectedOwner}
          selectedRepo={selectedRepo}
          selectedBranch={selectedBranch}
          file={selectedPayload?.file || selectedPayload?.errorCodeList || null}
        />
      </div>
    </div>
  );
};

export default EditorPage;
