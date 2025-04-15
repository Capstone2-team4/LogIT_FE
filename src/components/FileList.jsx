// ✅ FileList.jsx - 파일 클릭 시 patch 전달하도록 수정
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

const FileList = ({ owner, repo, commitId, onFileClick }) => {
  const [files, setFiles] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");

  useEffect(() => {
    if (!owner || !repo || !commitId) return;

    const fetchFiles = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const url = API.COMMIT_DETAILS(owner, repo, commitId);
        const res = await axios.get(url, config);

        const result = res.data.result;
        setFiles(result?.files || []);
        setCommitMessage(result?.commitResponseDTO?.message || "");
      } catch (err) {
        console.error("🔴 파일 목록 불러오기 실패:", err);
        setFiles([]);
        setCommitMessage("");
      }
    };

    fetchFiles();
  }, [owner, repo, commitId]);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold mb-2">
        📄{" "}
        <span className="bg-yellow-200 font-bold text-black">
          [
          {commitMessage.length > 30
            ? `${commitMessage.slice(0, 30)}...`
            : commitMessage}
          ]
        </span>{" "}
        <span className="text-gray-800">의 파일 목록</span>
      </h3>

      {files.length > 0 ? (
        <ul className="flex flex-col space-y-2 text-sm text-gray-700">
          {files.map((file) => (
            <li
              key={file.id}
              className="cursor-pointer px-2 py-1 border-b hover:bg-gray-100 hover:text-blue-700 transition"
              onClick={() =>
                onFileClick({
                  filename: file.filename,
                  patch: file.patch,
                })
              }
            >
              {file.filename.split("/").pop()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          해당 커밋에서 변경된 파일이 없습니다.
        </p>
      )}
    </div>
  );
};

export default FileList;
