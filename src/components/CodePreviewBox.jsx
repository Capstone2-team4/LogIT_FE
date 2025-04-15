import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";

const CodePreviewBox = ({ file }) => {
  return (
    <div className="border rounded-md p-4 mb-4 bg-white shadow-sm min-h-[280px]">
      {file ? (
        <>
          <h4 className="font-bold text-sm mb-2 text-gray-800">
            {file.filename}
          </h4>
          {file.patch ? (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <SyntaxHighlighter
                language="java"
                style={github}
                customStyle={{
                  fontSize: "12px",
                  borderRadius: "6px",
                  padding: "12px",
                }}
                wrapLines={true}
                wrapLongLines={true}
              >
                {file.patch}
              </SyntaxHighlighter>
            </div>
          ) : (
            <p className="text-sm text-gray-500">⚠️ patch 정보가 없습니다.</p>
          )}
        </>
      ) : (
        <div className="text-sm text-gray-400 h-full flex items-center justify-center text-center">
          커밋 메세지와 파일 이름을 선택하여 이 곳에서 코드를 미리 봅니다.
        </div>
      )}
    </div>
  );
};

export default CodePreviewBox;
