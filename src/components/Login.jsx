import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;
  const SCOPE = import.meta.env.VITE_GITHUB_SCOPE;

  const goSignupPage = () => {
    navigate("/signup");
  };

  useEffect(() => {
    setIsButtonDisabled(!(username && password));
  }, [username, password]);

  // ✅ 여기! login 함수 정의
  const login = async ({ username, password }) => {
    try {
      const response = await axios.post("http://localhost:8080/users/signin", {
        username,
        password,
      });

      const result = response.data.result;
      const accessToken = result.accessToken;

      return {
        success: true,
        accessToken,
        data: result,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("로그인 정보:", { username, password });

    const response = await login({ username, password });

    if (response.success) {
      console.log("로그인 성공 ✅", response.data);

      // 예: access token 저장 (필요 시)
      localStorage.setItem("accessToken", response.accessToken);
      const token = localStorage.getItem("accessToken");
      console.log("🔐 Access Token:", token);

      navigate("/main");
    } else {
      console.error("로그인 실패 ❌", response.message);
      alert("로그인 실패: " + response.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">LogIT 로그인</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            placeholder="아이디(Username)"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            type="password"
            value={password}
            placeholder="비밀번호"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              isButtonDisabled
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          <p className="text-gray-500">아직 회원이 아니신가요?</p>
          <span
            onClick={goSignupPage}
            className="font-bold text-blue-600 underline cursor-pointer"
          >
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
