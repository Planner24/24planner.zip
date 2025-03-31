import kakaoLogin from '../../assets/kakaoLogin.png';

export default function KakaoLogin() {
  const handleSocialLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    window.location.href = `${apiUrl}/api/oauth2/authorization/kakao`;
  };

  return (
    <img
      src={kakaoLogin}
      alt="카카오 로그인"
      className="cursor-pointer"
      onClick={handleSocialLogin}
    />
  );
}
