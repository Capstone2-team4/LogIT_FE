import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../config";
import CommitList from "./CommitList";

const AISummaryModal = ({
  isOpen,
  onClose,
  onSummaryComplete,
  initialOwner = "",
  initialRepo = "",
  initialBranch = "",
}) => {
  // GitHub 정보
  const [aiOwner, setAiOwner] = useState(initialOwner);
  const [aiRepo, setAiRepo] = useState(initialRepo);
  const [aiBranch, setAiBranch] = useState(initialBranch);

  // 탭 상태 제거
  // const [activeTab, setActiveTab] = useState("commit");

  // 요약 타입 상태 추가
  const [summaryType, setSummaryType] = useState("commit"); // "commit" 또는 "error"

  // 커밋 관련 상태
  const [selectedCommitIds, setSelectedCommitIds] = useState([]);
  const [selectedCommitMessages, setSelectedCommitMessages] = useState([]);

  // 에러 관련 상태
  const [selectedErrorId, setSelectedErrorId] = useState(null);
  const [selectedErrorTitle, setSelectedErrorTitle] = useState("");
  const [selectedCommitId, setSelectedCommitId] = useState("");
  const [currentErrors, setCurrentErrors] = useState([]); // 현재 커밋의 에러 목록 저장

  const [summaryTemplate, setSummaryTemplate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열릴 때마다 저장된 템플릿 불러오기
  useEffect(() => {
    if (!isOpen) return;

    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(API.SUMMARY_TEMPLATE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.result?.template) {
          setSummaryTemplate(data.result.template);
        }
      } catch (err) {
        console.error("템플릿 조회 실패:", err);
      }
    };

    fetchTemplate();
  }, [isOpen]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedCommitIds([]);
      setSelectedCommitMessages([]);
      setSelectedErrorId(null);
      setSelectedErrorTitle("");
      setSelectedCommitId("");
      setCurrentErrors([]);
      setSummaryType("commit");
    }
  }, [isOpen]);

  // 커밋 선택 토글
  const handleCommitClick = (id, message) => {
    setSelectedCommitIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setSelectedCommitMessages((prev) =>
      prev.includes(message)
        ? prev.filter((m) => m !== message)
        : [...prev, message]
    );
  };

  // 에러 탭에서 커밋 선택 (에러 목록을 보기 위함)
  const handleCommitSelectForError = async (id) => {
    setSelectedCommitId(id);
    // 커밋이 바뀌면 선택된 에러 초기화
    setSelectedErrorId(null);
    setSelectedErrorTitle("");

    // 새로운 커밋의 에러 목록 가져오기
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(API.ERROR_INFO_LIST(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentErrors(res.data.result.getErrorInfoResultDTOList || []);
    } catch (err) {
      console.error("🔴 에러 목록 불러오기 실패:", err);
      setCurrentErrors([]);
    }
  };

  // 에러 선택 해제
  const handleRemoveErrorSelection = () => {
    setSelectedErrorId(null);
    setSelectedErrorTitle("");
  };

  // 커밋 태그 제거
  const handleRemoveCommitTag = (index) => {
    setSelectedCommitMessages((prev) => prev.filter((_, i) => i !== index));
    setSelectedCommitIds((prev) => prev.filter((_, i) => i !== index));
  };

  // 템플릿 저장
  const handleTemplateSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        API.SUMMARY_TEMPLATE,
        { template: summaryTemplate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("템플릿이 저장되었습니다.");
    } catch (err) {
      console.error(err);
      alert("템플릿 저장 중 오류 발생");
    }
  };

  // AI 요약 실행
  const handleAISubmit = async () => {
    if (!canSubmit()) return;

    setIsLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      let summary = "";

      if (summaryType === "commit" && selectedCommitIds.length > 0) {
        // 커밋 요약
        console.log("📝 커밋 요약 요청:", {
          commitIdList: selectedCommitIds,
          template: summaryTemplate,
        });

        const { data } = await axios.post(
          API.SUMMARY(aiOwner, aiRepo),
          {
            commitIdList: selectedCommitIds,
            template: summaryTemplate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📝 커밋 요약 응답:", data);
        summary = data.result?.aiSummaryRecord;
      } else if (summaryType === "error" && selectedErrorId) {
        // 에러 요약
        const requestData = {
          template: summaryTemplate,
        };

        const requestUrl = API.ERROR_SUMMARY(selectedErrorId);

        console.log("🔴 에러 요약 요청:", {
          errorId: selectedErrorId,
          template: summaryTemplate,
          url: requestUrl,
          requestData,
          hasTemplate: !!summaryTemplate.trim(),
        });

        const { data } = await axios.post(requestUrl, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔴 에러 요약 응답:", data);

        summary = data.result?.aiSummaryRecord;
      }

      console.log("💡 추출된 summary:", summary);

      if (!summary || typeof summary !== "string" || summary.trim() === "") {
        console.error("❌ 요약 결과 확인:", {
          summary,
          type: typeof summary,
          length: summary?.length,
          trimmed: summary?.trim(),
        });

        // 백엔드에서 성공 응답이지만 결과가 비어있는 경우
        throw new Error(
          "AI 요약 결과가 비어있습니다. 템플릿이나 선택된 항목을 확인해주세요."
        );
      }

      // 부모 컴포넌트에 요약 결과 전달
      onSummaryComplete(summary);
      alert("AI 요약이 완료되었습니다!");
      onClose();
    } catch (err) {
      console.error("❌ AI 요약 중 오류 발생:", err);

      // 더 자세한 에러 정보
      if (err.response) {
        console.error("🔍 서버 응답 에러:", {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
        alert(
          `AI 요약 중 서버 오류 발생: ${err.response.status} - ${
            err.response.data?.message || err.message
          }`
        );
      } else if (err.request) {
        console.error("🔍 네트워크 에러:", err.request);
        alert("네트워크 오류가 발생했습니다. 연결을 확인해주세요.");
      } else {
        alert(`AI 요약 중 오류 발생: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 요약하기 버튼 활성화 조건
  const canSubmit = () => {
    const hasSelection =
      summaryType === "commit"
        ? selectedCommitIds.length > 0
        : selectedErrorId !== null;
    return hasSelection && summaryTemplate.trim() && !isLoading;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md w-11/12 max-w-5xl h-4/5 p-6 flex flex-col relative z-50 modal-dropdown-fix">
        <h2 className="text-xl font-bold mb-4">AI 요약할 항목을 선택하세요</h2>

        {/* 탭 버튼 */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setSummaryType("commit")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              summaryType === "commit"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📝 커밋 요약
          </button>
          <button
            onClick={() => setSummaryType("error")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              summaryType === "error"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            🔴 에러 요약
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 flex overflow-hidden gap-4 relative z-40">
          {summaryType === "commit" ? (
            // 커밋 요약 모드
            <div className="flex-1 overflow-y-auto border p-4 rounded relative z-30">
              <h3 className="text-sm font-bold mb-2">📝 커밋 선택</h3>
              <CommitList
                selectedOwner={aiOwner}
                selectedRepo={aiRepo}
                selectedBranch={aiBranch}
                setParentOwner={setAiOwner}
                setParentRepo={setAiRepo}
                setParentBranch={setAiBranch}
                setClickedCommitId={handleCommitClick}
              />
            </div>
          ) : (
            // 에러 요약 모드
            <>
              {/* 커밋 리스트 */}
              <div className="w-1/2 overflow-y-auto border p-4 rounded relative z-30">
                <h3 className="text-sm font-bold mb-2">📝 커밋 선택</h3>
                <p className="text-xs text-gray-500 mb-3">
                  에러가 포함된 커밋을 선택하세요
                </p>
                <CommitList
                  selectedOwner={aiOwner}
                  selectedRepo={aiRepo}
                  selectedBranch={aiBranch}
                  setParentOwner={setAiOwner}
                  setParentRepo={setAiRepo}
                  setParentBranch={setAiBranch}
                  setClickedCommitId={handleCommitSelectForError}
                />
              </div>

              {/* 에러 리스트 */}
              <div className="w-1/2 overflow-y-auto border p-4 rounded relative z-20">
                <h3 className="text-sm font-bold mb-2">🔴 에러 선택</h3>
                <p className="text-xs text-gray-500 mb-3">
                  요약할 에러를 하나 선택하세요
                </p>
                {selectedCommitId && currentErrors.length > 0 ? (
                  <ul className="flex flex-col space-y-2 text-sm text-gray-700">
                    {currentErrors.map((errorInfo) => (
                      <li
                        key={errorInfo.errorInfoId}
                        className={`cursor-pointer px-2 py-1 border-b transition ${
                          selectedErrorId === errorInfo.errorInfoId
                            ? "bg-red-100 border-red-300"
                            : "hover:bg-gray-100 hover:text-blue-700"
                        }`}
                        onClick={() => {
                          if (selectedErrorId === errorInfo.errorInfoId) {
                            setSelectedErrorId(null);
                            setSelectedErrorTitle("");
                          } else {
                            setSelectedErrorId(errorInfo.errorInfoId);
                            setSelectedErrorTitle(
                              errorInfo.title || "Unnamed Error"
                            );
                          }
                        }}
                      >
                        <p className="font-bold">{errorInfo.title}</p>
                        {errorInfo.content && (
                          <p className="text-gray-600 text-xs">
                            {errorInfo.content.length > 50
                              ? `${errorInfo.content.slice(0, 50)}...`
                              : errorInfo.content}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : selectedCommitId ? (
                  <p className="text-sm text-gray-500">
                    해당 커밋에서 에러 정보를 찾을 수 없습니다.
                  </p>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">⬅️</div>
                    <p className="text-sm text-gray-500">
                      먼저 커밋을 선택하세요
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* 선택된 항목 표시 */}
        {(selectedCommitMessages.length > 0 || selectedErrorTitle) && (
          <div className="mt-4 mb-4">
            {/* 에러 모드에서 선택된 에러 표시 */}
            {summaryType === "error" && selectedErrorTitle && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-red-700 mt-1">
                    선택된 에러: 🔴 {selectedErrorTitle}
                  </div>
                  <button
                    onClick={handleRemoveErrorSelection}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* 선택된 커밋 메시지들 */}
            {selectedCommitMessages.length > 0 && (
              <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                {selectedCommitMessages.map((msg, idx) => (
                  <span
                    key={`commit-${idx}`}
                    className="flex items-center bg-blue-100 px-2 py-1 rounded text-sm"
                  >
                    📝 {msg.length > 30 ? `${msg.slice(0, 30)}...` : msg}
                    <button
                      onClick={() => handleRemoveCommitTag(idx)}
                      className="ml-1 text-gray-500 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 템플릿 입력 */}
        <textarea
          value={summaryTemplate}
          onChange={(e) => setSummaryTemplate(e.target.value)}
          placeholder="요약에 사용할 템플릿을 입력하세요..."
          className="w-full h-24 border rounded p-2 mb-4 resize-none text-sm"
          disabled={isLoading}
        />

        {/* 버튼 그룹 */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleTemplateSave}
            disabled={isLoading}
            className="mr-auto px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 disabled:bg-gray-300"
          >
            템플릿 저장
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300 disabled:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleAISubmit}
            disabled={!canSubmit()}
            className={`px-4 py-2 rounded-md text-white ${
              !canSubmit()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "요약 중..." : "요약하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISummaryModal;
