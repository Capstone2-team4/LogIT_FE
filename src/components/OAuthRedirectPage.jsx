import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const OAuthRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");

    if (accessToken) {
      // 👉 accessToken 저장 (예: localStorage, recoil, zustand 등)
      localStorage.setItem("accessToken", accessToken);

      // ✅ 저장 직후 로그로 확인
      console.log(
        "✅ accessToken 저장됨:",
        localStorage.getItem("accessToken")
      );

      // ✅ 리다이렉트 전 쿼리파라미터 제거하고 싶으면:
      window.history.replaceState({}, "", "/");

      // ✅ 메인 화면으로 이동
      navigate("/main");
    } else {
      console.warn("❌ accessToken이 없음! 로그인 실패 처리");
      navigate("/login");
    }
  }, []);

  return <div>🔐 로그인 중입니다...</div>;
};

export default OAuthRedirectPage;
