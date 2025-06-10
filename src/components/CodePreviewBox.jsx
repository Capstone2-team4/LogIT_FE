import { useState, useEffect } from "react";
import { useMemo } from "react";
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


// 하이라이팅 로직 함수
// const renderHighlightedCode = (source, codeBlocks = []) => {
//   const sortedBlocks = [...codeBlocks].sort((a, b) => a.startOffset - b.startOffset);
//   let lastIndex = 0;
//   const elements = [];

//   sortedBlocks.forEach((block, i) => {
//     if (block.startOffset > lastIndex) {
//       elements.push(
//         <span key={`plain-${i}`}>
//           {source.slice(lastIndex, block.startOffset)}
//         </span>
//       );
//     }

//     elements.push(
//       <span
//         key={`highlight-${i}`}
//         className="relative group bg-yellow-200 text-black rounded-sm px-1 cursor-pointer"
//       >
//         {source.slice(block.startOffset, block.endOffset)}
//         <span
//         className="absolute bottom-full left-0 translate-x-2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded-md shadow-lg z-50 hidden group-hover:block"
//         style={{
//         whiteSpace: 'normal',               
//         overflowWrap: 'anywhere',           
//         maxWidth: '500px',                  
//         width: 'max-content',             
//         maxHeight: '300px',                 
//         overflowY: 'auto',                 
//         }}  
// >
//   {block.content}
// </span>

//       </span>
//     );

//     lastIndex = block.endOffset;
//   });

//   if (lastIndex < source.length) {
//     elements.push(<span key="last">{source.slice(lastIndex)}</span>);
//   }

//   return elements;
// };

// 줄별 하이라이팅 대상 계산 함수
const getHighlightedLines = (source, blocks) => {
  const lines = source.split("\n");
  const lineSet = new Set();

  blocks?.forEach(({ startOffset, endOffset }) => {
    let curr = 0;
    for (let i = 0; i < lines.length; i++) {
      const len = lines[i].length + 1; // +1 for \n
      const lineStart = curr;
      const lineEnd = curr + len;

      if (endOffset > lineStart && startOffset < lineEnd) {
        lineSet.add(i + 1); // 1-based line number
      }

      curr += len;
    }
  });

  return lineSet;
};

const lineToTooltipMap = useMemo(() => {
  if (!file?.patch || !file.codeBlocks) return new Map();

  const map = new Map();
  const lines = file.patch.split("\n");
  let curr = 0;

  lines.forEach((line, i) => {
    const lineStart = curr;
    const lineEnd = curr + line.length + 1;

    file.codeBlocks.forEach((block) => {
      if (block.startOffset > lineStart && block.startOffset < lineEnd) {
        if (!map.has(i + 1)) map.set(i + 1, []);
        map.get(i + 1).push(block.content);
      }
    });

    curr += line.length + 1;
  });

  return map;
}, [file?.patch, file?.codeBlocks]);


  // // 커밋 뷰
  // if (file && file.patch) {
  //   return (
  //     <div className="border rounded-md p-4 mb-4 shadow-sm min-h-[700px] flex flex-col">
  //       {/* 파일 이름 */}
  //       <h4 className="font-bold text-sm mb-1 text-gray-800">
  //         {file.filename.split(/\\|\//).pop()}
  //       </h4>
  //       <div className="flex-1 overflow-auto bg-white p-4 rounded">
  //         <SyntaxHighlighter
  //           language="java"
  //           style={github}
  //           customStyle={{ fontSize: "12px" }}
  //           wrapLines
  //           wrapLongLines
  //         >
              
  //         </SyntaxHighlighter>
  //       </div>
  //     </div>
  //   );
  // }
// if (file && file.patch) {
//   return (
//     <div className="border rounded-md p-4 mb-4 shadow-sm min-h-[700px] flex flex-col">
//       {/* 파일 이름 */}
//       <h4 className="font-bold text-sm mb-1 text-gray-800">
//         {file.filename.split(/\\|\//).pop()}
//       </h4>
//       <div className="flex-1 overflow-auto bg-white p-4 rounded">
//         <pre className="whitespace-pre-wrap font-mono text-sm">
//           {renderHighlightedCode(file.patch, file.codeBlocks)}
//         </pre>
//       </div>
//     </div>
//   );
// }

const highlightedLines = useMemo(() => {
  if (!file?.patch || !file.codeBlocks) return new Set();
  return getHighlightedLines(file.patch, file.codeBlocks);
}, [file?.patch, file?.codeBlocks]);

if (file && file.patch) {
  return (
    <div className="border rounded-md p-4 mb-4 shadow-sm min-h-[700px] flex flex-col">
      <h4 className="font-bold text-sm mb-1 text-gray-800">
        {file.filename.split(/\\|\//).pop()}
      </h4>
      <div className="flex-1 overflow-auto bg-white p-4 rounded">
        <SyntaxHighlighter
          language="java"
          style={github}
          customStyle={{
            fontSize: "12px",
            backgroundColor: "white",
            padding: "0",
            margin: "0",
          }}
          wrapLines
          showLineNumbers
          lineProps={(lineNumber) => {
            const isHighlighted = highlightedLines.has(lineNumber);
            const contents = lineToTooltipMap.get(lineNumber);

            return {
              className: contents ? "relative tooltip-line" : "",
              style: isHighlighted
                ? {
                    backgroundColor: "#fff3b0",
                    cursor: "pointer",
                  }
                : {},
              "data-tooltip": contents ? contents.join("\n") : undefined,
            };
          }}
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
