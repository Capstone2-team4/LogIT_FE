import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const goSignupPage = () => {
    navigate("/signup");
  };

  useEffect(() => {
    setIsButtonDisabled(!(username && password));
  }, [username, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 정보:", { username, password });
    navigate("/main");
  };

  const handleGithubLogin = () => {
    console.log("🔐 GitHub 로그인 시도!");
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

        <div className="mt-6">
          <button
            type="button"
            onClick={handleGithubLogin}
            className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 w-full"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                clipRule="evenodd"
              />
            </svg>
            GitHub로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
