// src/pages/EditorPage.jsx

import { useState } from "react";
import CommitList from "../components/CommitList";
import FileList from "../components/FileList";
import CodePreviewBox from "../components/CodePreviewBox";
import EditorArea from "../components/EditorArea";

const EditorPage = () => {
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [clickedCommitId, setClickedCommitId] = useState(null);

  // 선택된 커밋 파일 또는 에러 코드 리스트 객체
  const [selectedPayload, setSelectedPayload] = useState(null);
  // 선택된 에러 정보 ID
  const [selectedErrorInfoId, setSelectedErrorInfoId] = useState(null);

  const handleFileClick = (payload) => {
    // 커밋 파일 클릭
    if (payload.filename) {
      setSelectedPayload({ file: payload });
      setSelectedErrorInfoId(null);
    }
    // 에러 리스트 항목 클릭: 우선 errorInfoId 전달
    else if (payload.errorInfoId) {
      setSelectedErrorInfoId(payload.errorInfoId);
      setSelectedPayload(null);
    }
    // 에러 코드 리스트 전달
    else if (payload.errorCodeList) {
      setSelectedPayload({ errorCodeList: payload.errorCodeList });
      setSelectedErrorInfoId(null);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] m-4 gap-4">
      <div className="w-[25%] flex flex-col">
        <div className="flex-1 overflow-auto">
          <CommitList
            setSelectedOwner={setSelectedOwner}
            setSelectedRepo={setSelectedRepo}
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

      <div className="w-[35%] overflow-auto">
        <CodePreviewBox
          file={selectedPayload?.file || null}
          errorInfoId={selectedErrorInfoId}
          errorCodeList={selectedPayload?.errorCodeList || null}
        />
      </div>

      <div className="w-[40%] overflow-auto">
        <EditorArea
          selectedOwner={selectedOwner}
          selectedRepo={selectedRepo}
          file={selectedPayload?.file || selectedPayload?.errorCodeList || null}
        />
      </div>
    </div>
  );
};

export default EditorPage;
