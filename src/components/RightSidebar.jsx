import CodePreviewBox from "./CodePreviewBox";
import CodeList from "./CodeList";

const RightSidebar = () => {
  return (
    <div className="w-72 flex flex-col gap-4 relative py-10">
      <CodePreviewBox />
      <CodeList />
    </div>
  );
};

export default RightSidebar;
