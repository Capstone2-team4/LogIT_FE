import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CommitList from "../components/CommitList";
import FileList from "../components/FileList";
import CodePreviewBox from "../components/CodePreviewBox";
import EditorArea from "../components/EditorArea";

const EditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { owner, repo } = location.state || {};

  const [selectedOwner, setSelectedOwner] = useState(owner);
  const [selectedRepo, setSelectedRepo] = useState(repo);
  const [clickedCommitId, setClickedCommitId] = useState(null);

  useEffect(() => {
    if (!owner || !repo) {
      navigate("/main");
    }
  }, [owner, repo, navigate]);

  return (
    <div className="flex h-screen bg-gray-50 px-4 py-6 gap-x-4">
      {/* 왼쪽: CommitList + FileList */}
      <div className="w-[25%] bg-white rounded-2xl shadow p-3 flex flex-col">
        <div className="flex-1 overflow-auto border-b pb-2 mb-2">
          <CommitList
            selectedOwner={selectedOwner}
            selectedRepo={selectedRepo}
            setSelectedOwner={setSelectedOwner}
            setSelectedRepo={setSelectedRepo}
            setClickedCommitId={setClickedCommitId}
          />
        </div>
        <div className="flex-1 overflow-auto pt-2">
          <FileList
            selectedOwner={selectedOwner}
            selectedRepo={selectedRepo}
            commitId={clickedCommitId}
          />
        </div>
      </div>

      {/* 가운데: CodePreviewBox */}
      <div className="w-[35%] bg-white rounded-2xl shadow p-4 overflow-auto">
        <CodePreviewBox commitId={clickedCommitId} />
      </div>

      {/* 오른쪽: EditorArea */}
      <div className="w-[40%] bg-white rounded-2xl shadow p-4 overflow-auto">
        <EditorArea selectedOwner={selectedOwner} selectedRepo={selectedRepo} />
      </div>
    </div>
  );
};

export default EditorPage;
