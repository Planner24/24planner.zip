import kakaoLogin from '../../assets/kakaoLogin.png';
import SocialLoginButton from './SocialLoginButton';

export default function KakaoLogin() {
  return <SocialLoginButton provider="kakao" icon={kakaoLogin} altText="카카오 로그인" />;
}
