import { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";

const FileList = ({ owner, repo, commitId, onFileClick }) => {
  const [viewType, setViewType] = useState("commit"); // 'commit' or 'error'
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");

  useEffect(() => {
    if (!commitId) return;

    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(API.COMMIT_DETAILS(owner, repo, commitId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = res.data.result;
        setFiles(result?.files || []);
        setCommitMessage(result?.commitResponseDTO?.message || "");
      } catch (err) {
        console.error("🔴 파일 목록 불러오기 실패:", err);
        setFiles([]);
        setCommitMessage("");
      }
    };

    const fetchErrors = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(API.ERROR_INFO_LIST(commitId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setErrors(res.data.result.getErrorInfoResultDTOList || []);
      } catch (err) {
        console.error("🔴 에러 목록 불러오기 실패:", err);
        setErrors([]);
      }
    };

    viewType === "commit" ? fetchFiles() : fetchErrors();
  }, [owner, repo, commitId, viewType]);

  const truncate = (text, max = 100) =>
    text?.length > max ? `${text.slice(0, max)}...` : text;

  // 클릭된 커밋 파일에 대해 전체 코드 조회 요청
  const handleCommitFileClick = async (file) => {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await axios.get(
        API.GET_SOURCE(owner, repo, file.filename, commitId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ GET_SOURCE response:", res.data); // 콘솔에서 잘 갔는지 확인 가능
      onFileClick({
        filename: file.filename,
        patch: res.data.result.content,
        fullSource: res.data.result,
      });
    } catch (err) {
      console.error("🔴 전체 코드 로드 실패:", err);
      onFileClick({ filename: file.filename, patch: file.patch });
    }
  };

  // 에러 항목 클릭 시 에러코드 리스트까지 가져와서 상위로 전달
  const handleErrorClick = async (errorInfoId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(API.ERROR_CODE_LIST(errorInfoId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      onFileClick({ errorCodeList: res.data.result.errorCodeList || [] });
    } catch (err) {
      console.error("🔴 에러 코드 로드 실패:", err);
      onFileClick({ errorCodeList: [] });
    }
  };

  return (
    <div className="mt-4">
      {/* 라디오 버튼 */}
      <div className="flex items-center space-x-4 mb-2">
        <label className="inline-flex items-center text-sm">
          <input
            type="radio"
            className="form-radio"
            name="viewType"
            value="commit"
            checked={viewType === "commit"}
            onChange={() => setViewType("commit")}
          />
          <span className="ml-2">커밋</span>
        </label>
        <label className="inline-flex items-center text-sm">
          <input
            type="radio"
            className="form-radio"
            name="viewType"
            value="error"
            checked={viewType === "error"}
            onChange={() => setViewType("error")}
          />
          <span className="ml-2">에러</span>
        </label>
      </div>

      {viewType === "commit" ? (
        <>
          <h3 className="text-sm font-bold mb-2">
            📄{" "}
            <span className="bg-yellow-200 font-bold text-black">
              [{truncate(commitMessage, 30)}]
            </span>{" "}
            <span className="text-gray-800">의 파일 목록</span>
          </h3>
          {files.length > 0 ? (
            <ul className="flex flex-col space-y-2 text-sm text-gray-700">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="cursor-pointer px-2 py-1 border-b hover:bg-gray-100 hover:text-blue-700 transition"
                  onClick={() => handleCommitFileClick(file)}
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
        </>
      ) : (
        <>
          <h3 className="text-sm font-bold mb-2">
            🔴{" "}
            <span className="bg-yellow-200 font-bold text-black">
              [{truncate(commitMessage, 30)}]
            </span>{" "}
            <span className="text-gray-800">의 에러 목록</span>
          </h3>
          {errors.length > 0 ? (
            <ul className="flex flex-col space-y-2 text-sm text-gray-700">
              {errors.map((errInfo) => (
                <li
                  key={errInfo.errorInfoId}
                  className="cursor-pointer px-2 py-1 border-b hover:bg-gray-100 hover:text-blue-700 transition"
                  onClick={() => handleErrorClick(errInfo.errorInfoId)}
                >
                  <p className="font-bold">{errInfo.title}</p>
                  {errInfo.content && <p>{truncate(errInfo.content)}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              해당 커밋에서 에러 정보를 찾을 수 없습니다.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default FileList;
