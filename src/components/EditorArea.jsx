import React, { useEffect, useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { codeBlock } from "@blocknote/code-block";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import axios from "axios";
import API from "../config";
import debounce from "lodash.debounce";
import CommitList from "../components/CommitList";
import "./editor.css";

const EditorArea = ({ setPosts, onUploadSuccess }) => {
  const [editorTitle, setEditorTitle] = useState("");
  const editor = useCreateBlockNote({ codeBlock });

  // GitHub 정보
  const [aiOwner, setAiOwner] = useState("");
  const [aiRepo, setAiRepo] = useState("");
  const [aiBranch, setAiBranch] = useState("");

  // 모달 상태
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedCommitIds, setSelectedCommitIds] = useState([]);
  const [selectedCommitMessages, setSelectedCommitMessages] = useState([]);
  const [summaryTemplate, setSummaryTemplate] = useState("");

  // 드래프트 자동 저장
  useEffect(() => {
    if (!editor) return;
    const autosave = debounce(() => {
      if (editor.commands?.getHTML) {
        localStorage.setItem("draft", editor.getHTML());
      }
    }, 1000);
    editor.on("transaction", autosave);
    const saved = localStorage.getItem("draft");
    if (saved && editor.commands?.setHTML) {
      editor.commands.setHTML(saved);
    }
    return () => editor.off("transaction", autosave);
  }, [editor]);

  // 저장된 템플릿 불러오기
  useEffect(() => {
    if (!isAIModalOpen) return;
    const token = localStorage.getItem("accessToken");
    axios
      .get(API.SUMMARY_TEMPLATE, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.result?.template) setSummaryTemplate(data.result.template);
      })
      .catch((err) => console.error("템플릿 조회 실패:", err));
  }, [isAIModalOpen]);

  // 글 업로드
  const handleUpload = async () => {
    const token = localStorage.getItem("accessToken");
    if (!editor) return;
    try {
      const html = await editor.blocksToFullHTML(editor.document);
      const res = await axios.post(
        API.CREATE_RECORD,
        { title: editorTitle, content: html },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("업로드 완료!");
      const post = res.data.result;
      setPosts((prev) => [
        {
          id: post.recordId,
          title: post.title,
          author: post.author,
          preview: [post.content],
          date: new Date(post.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          tags: [],
        },
        ...prev,
      ]);
      onUploadSuccess?.();
    } catch (err) {
      console.error(err);
      alert("업로드 실패! 서버 확인 필요.");
    }
  };

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

  // 템플릿 저장
  const handleTemplateSave = async () => {
    const token = localStorage.getItem("accessToken");
    try {
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

  // AI 요약 함수 (에디터에 바로 삽입 기능까지)
  const handleAISubmit = async () => {
    const token = localStorage.getItem("accessToken");

    try {
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

      const summary = data.result.aiSummaryRecord;
      console.log("✅ AI summary:", summary);

      if (!summary || typeof summary !== "string") {
        throw new Error("AI 요약 결과가 없습니다");
      }

      // 기존 내용 뒤에 마크다운 형식으로 바꾼 글 추가
      const blocks = await editor.tryParseMarkdownToBlocks(summary);
      editor.insertBlocks(
        blocks,
        editor.document[editor.document.length - 1],
        "after"
      );

      editor.focus();
      alert("AI 요약이 완료되었습니다!");
    } catch (err) {
      console.error("❌ AI 요약 중 오류 발생:", err);
      alert(`AI 요약 중 오류 발생: ${err.message}`);
    } finally {
      setIsAIModalOpen(false);
      setSelectedCommitIds([]);
      setSelectedCommitMessages([]);
      setSummaryTemplate("");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center">
      {/* 에디터 */}
      <div className="w-full max-w-6xl rounded-md flex flex-col h-full">
        <div className="border-b p-4">
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full text-2xl font-bold focus:outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto w-full p-4">
          {editor ? (
            <BlockNoteView
              editor={editor}
              className="bn-editor editor-wrapper w-full h-full"
              style={{ minHeight: "600px" }}
            />
          ) : (
            <p className="text-gray-400">에디터 로딩 중...</p>
          )}
        </div>
        <div className="border-t p-4 flex justify-end gap-2">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-gray-800"
          >
            AI 요약✨
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-1.5 bg-black text-white rounded-md text-sm hover:bg-gray-800"
          >
            업로드
          </button>
        </div>
      </div>

      {/* AI 요약 모달 */}
      {isAIModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-11/12 max-w-3xl h-4/5 p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4">
              AI 요약할 커밋 리스트를 선택하세요.
            </h2>
            <div className="flex-1 overflow-y-auto border p-4 rounded mb-4">
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
            {selectedCommitMessages.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCommitMessages.map((msg, idx) => (
                  <span
                    key={idx}
                    className="flex items-center bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    {msg}
                    <button
                      onClick={() => {
                        setSelectedCommitMessages((prev) =>
                          prev.filter((_, i) => i !== idx)
                        );
                        setSelectedCommitIds((prev) =>
                          prev.filter((_, i) => i !== idx)
                        );
                      }}
                      className="ml-1 text-gray-500 hover:text-gray-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <textarea
              value={summaryTemplate}
              onChange={(e) => setSummaryTemplate(e.target.value)}
              placeholder="요약에 사용할 템플릿을 입력하세요..."
              className="w-full h-24 border rounded p-2 mb-4 resize-none text-sm"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleTemplateSave}
                className="mr-auto px-4 py-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
              >
                템플릿 저장
              </button>
              <button
                onClick={() => setIsAIModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-md text-sm"
              >
                취소
              </button>
              <button
                onClick={handleAISubmit}
                disabled={!selectedCommitIds.length || !summaryTemplate}
                className={`px-4 py-2 rounded-md text-white ${
                  !selectedCommitIds.length || !summaryTemplate
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                요약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorArea;
