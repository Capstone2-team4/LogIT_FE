import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useState(""); // 아이디
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (name && nickname && username && email && password && confirmPassword) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [name, nickname, username, email, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다");
      return;
    }

    console.log("회원가입 정보:", {
      name,
      nickname,
      username,
      email,
      password,
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">LogIT 회원가입</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            placeholder="이름"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            value={nickname}
            placeholder="닉네임"
            onChange={(e) => setNickname(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            value={username}
            placeholder="아이디"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            type="email"
            value={email}
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
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
          <input
            type="password"
            value={confirmPassword}
            placeholder="비밀번호 확인"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            회원가입
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 text-red-500 text-sm text-center font-medium">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
