// src/pages/EditorPage.jsx

import { useState } from "react";
import CommitList from "../components/CommitList";
import FileList from "../components/FileList";
import CodePreviewBox from "../components/CodePreviewBox";
import EditorArea from "../components/EditorArea";

const EditorPage = () => {
  // 현재 선택된 Owner, Repo
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);

  // 클릭된 Commit ID
  const [clickedCommitId, setClickedCommitId] = useState(null);

  // 선택된 파일 (patch 정보 포함)
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="flex h-[calc(100vh-2rem)] m-4 gap-4">
      {/* 왼쪽: CommitList + FileList */}
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
            onFileClick={setSelectedFile}
          />
        </div>
      </div>

      {/* 가운데: CodePreviewBox */}
      <div className="w-[35%] overflow-auto">
        <CodePreviewBox file={selectedFile} />
      </div>

      {/* 오른쪽: EditorArea */}
      <div className="w-[40%] overflow-auto">
        <EditorArea
          selectedOwner={selectedOwner}
          selectedRepo={selectedRepo}
          file={selectedFile}
        />
      </div>
    </div>
  );
};

export default EditorPage;
