import CodePreviewBox from "./CodePreviewBox";
import CodeList from "./CodeList";

const RightSidebar = () => {
  return (
    <div className="w-96 flex-1 flex-col gap-4 relative py-10">
      <CodePreviewBox />
      <CodeList />
    </div>
  );
};

export default RightSidebar;
