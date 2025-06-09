import { useState, useEffect } from "react";
import axios from "axios";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import API from "../config";

const CodePreviewBox = ({ file, errorInfoId, errorCodeList }) => {
  const [viewMode, setViewMode] = useState("errorCode"); // 에러코드가 디폴트
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    const loadCodes = async () => {
      if (viewMode === "errorCode") {
        if (errorCodeList && errorCodeList.length) {
          setCodes(errorCodeList.slice(-3));
          return;
        }
        if (!errorInfoId) {
          setCodes([]);
          return;
        }
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(API.ERROR_CODE_LIST(errorInfoId), {
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = res.data.result.errorCodeList || [];
          setCodes(list.slice(-3));
        } catch (err) {
          console.error("🔴 에러코드 로드 실패:", err);
          setCodes([]);
        }
      } else if (viewMode === "solution") {
        if (!errorInfoId) {
          setCodes([]);
          return;
        }
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(API.ERROR_SOLVED_CODE_LIST(errorInfoId), {
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = res.data.result.errorSolvedCodeList || [];
          setCodes(list.slice(-3));
        } catch (err) {
          console.error("🔴 해결과정 로드 실패:", err);
          setCodes([]);
        }
      }
    };
    loadCodes();
  }, [viewMode, errorInfoId, errorCodeList]);

  // 커밋 뷰
  if (file && file.patch) {
    return (
      <div className="rounded-md p-4 mb-4  flex flex-col">
        {/* 파일 이름 */}
        <h4 className="font-bold text-sm mb-1 text-gray-800">
          {file.filename.split(/\\|\//).pop()}
        </h4>
        <div className="flex-1 overflow-auto bg-white rounded">
          <SyntaxHighlighter
            language="java"
            style={github}
            customStyle={{ fontSize: "12px" }}
            wrapLines
            wrapLongLines
          >
            {file.patch}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  // 에러 뷰
  if (errorInfoId || (errorCodeList && errorCodeList.length >= 0)) {
    return (
      <div className="border rounded-md p-4 mb-4 bg-white shadow-sm min-h-[580px] flex flex-col">
        <div className="mb-2">
          <label className="inline-flex items-center mr-4 text-sm">
            <input
              type="radio"
              name="codeView"
              value="errorCode"
              checked={viewMode === "errorCode"}
              onChange={() => setViewMode("errorCode")}
              className="form-radio"
            />
            <span className="ml-2">에러코드</span>
          </label>
          <label className="inline-flex items-center text-sm">
            <input
              type="radio"
              name="codeView"
              value="solution"
              checked={viewMode === "solution"}
              onChange={() => setViewMode("solution")}
              className="form-radio"
            />
            <span className="ml-2">해결 과정</span>
          </label>
        </div>
        {codes.length > 0 ? (
          <div className="overflow-y-auto flex-1">
            {codes.map((item, idx) => (
              <div key={idx} className="mb-4">
                {item.filePath && (
                  <h4 className="font-bold text-sm mb-1 text-gray-800">
                    {item.filePath.split(/\\|\//).pop()}
                  </h4>
                )}
                <SyntaxHighlighter
                  language="java"
                  style={github}
                  customStyle={{
                    fontSize: "12px",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                  wrapLines
                  wrapLongLines
                >
                  {item.code}
                </SyntaxHighlighter>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 flex-1 flex items-center justify-center">
            {viewMode === "errorCode"
              ? "에러 코드를 불러올 수 없습니다."
              : "해결 과정을 불러올 수 없습니다."}
          </div>
        )}
      </div>
    );
  }

  // Placeholder
  return (
    <div className="text-sm text-gray-400 h-full flex items-center justify-center text-center">
      커밋 메시지와 파일 또는 에러 항목을 선택하여 이 곳에서 코드를 봅니다.
    </div>
  );
};

export default CodePreviewBox;
