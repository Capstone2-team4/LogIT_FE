import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../config";

const OAuthRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const registerGithubUser = async () => {
      const providerId = searchParams.get("providerId");

      if (providerId) {
        // ✅ 쿼리 파라미터 제거
        window.history.replaceState({}, "", "/");

        try {
          const response = await registerGithub({ providerId });

          if (response.success) {
            console.log("깃허브 등록 성공 ✅", response.data);
            navigate("/main");
          } else {
            console.error("깃허브 등록 실패 ❌", response.message);
            alert("깃허브 등록 실패: " + response.message);
          }
        } catch (err) {
          console.error("API 요청 중 에러 ❌", err);
          alert("서버 요청 중 문제가 발생했습니다.");
        }
      } else {
        console.warn("❌ providerId가 없음! 깃허브 연동 실패 처리");
        navigate("/main");
      }
    };

    registerGithubUser();
  }, []);

  // ✅ 여기! login 함수 정의
  const registerGithub = async ({ providerId }) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        API.REGISTER_GITHUB,
        { providerId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return {
        success: true,
      };
    } catch (error) {
      console.error("register github api error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "register github failed",
      };
    }
  };

  return <div>🔐 깃허브 연동 중입니다...</div>;
};

export default OAuthRedirectPage;
