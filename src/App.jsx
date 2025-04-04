import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import MainLayout from "./pages/MainLayout"; // 새로 만든 컴포넌트

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/main" element={<MainLayout />} /> {/* ← 메인화면 */}
    </Routes>
  );
}

export default App;
