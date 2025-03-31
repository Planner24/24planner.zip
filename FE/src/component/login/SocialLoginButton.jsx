export default function SocialLoginButton({ provider, icon, altText }) {
  const handleSocialLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    // window.location.href = `${apiUrl}/api/oauth2/authorize/${provider}`;
    window.location.href = `${apiUrl}/api/oauth2/authorization/kakao`

  };

  return <img src={icon} alt={altText} className="cursor-pointer" onClick={handleSocialLogin} />;
}
