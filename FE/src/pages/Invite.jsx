import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../logo.png';
import housemateApi from '../api/housemateApi';
import { useSelector } from 'react-redux';

export default function Invite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // 상태 관리 데이터
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState(null);

  // 로고 클릭 시 메인페이지로 이동
  const toHome = () => {
    navigate('/');
  };

  // 초대 링크 검증
  useEffect(() => {
    if (!token) {
      setError('유효하지 않은 초대 링크입니다.');
      return;
    }

    const validateInvitation = async () => {
      try {
        const response = await housemateApi.validateInvitation(token);
        const data = response.data.data;

        setInviteData(data);

        if (data) {
          // 메타 태그 동적 업데이트
          document.title = `${data.planTitle} 이사 플랜으로 초대합니다! | 이사모음.zip`;

          updateMetaTags({
            description: `${data.inviterName || '누군가'}님의 이사 플랜에 함께 하세요!`,
            ogTitle: `${data.planTitle} 이사 플랜으로 초대합니다! | 이사모음.zip`,
            ogDescription: `${data.inviterName || '누군가'}님의 이사 플랜에 함께 하세요!`,
            ogImage: `${window.location.origin}/logo.png`,
            ogUrl: window.location.href,
          });
        }
      } catch (error) {
        const errordata = error.response.data;

        if (errordata.code === 'INVALID_INVITATION') {
          setError(errordata.message);
        }
      }
    };

    validateInvitation();
  }, [token]);

  const updateMetaTags = (metaInfo) => {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', metaInfo.description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', metaInfo.ogTitle);

    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', metaInfo.ogDescription);

    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    ogImage.setAttribute('content', metaInfo.ogImage);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', metaInfo.ogUrl);

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');
  };

  // 초대 수락
  const accpetInvitaion = async () => {
    if (!isLoggedIn) {
      const confirmLogin = window.confirm('초대 수락을 위해서는 로그인이 필요합니다.');

      if (confirmLogin) {
        navigate(
          `/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`,
        );
      }
      return;
    }

    try {
      const response = await housemateApi.acceptInvitation(token);
      const data = response.data.data;

      navigate(`/plans/${data.movingPlanId}`);
    } catch (error) {
      const errordata = error.response.data;

      if (errordata.code === 'INVALID_INVITATION' || errordata.code === 'ALREADY_REGISTERED') {
        setError(errordata.message);
      } else {
        setError('동거인 초대 수락에 실패했습니다.');
      }
    }
  };

  // CSS
  const displayStyle = 'h-screen flex flex-col justify-center items-center gap-20 text-center';
  const logoStyle = 'w-48 cursor-pointer';
  const explainTextStyle = 'mb-15 text-3xl';
  const explain2TextStyle = 'mb-5 text-2xl';
  const inviteButton = 'mb-20 text-xl text-gray-500 underline cursor-pointer hover:text-primary';

  const errorTextStyle = 'mb-40 text-2xl';

  if (error) {
    return (
      <div className={displayStyle}>
        <img src={logo} alt="이사모음집 로고" className={logoStyle} onClick={toHome} />
        <h2 className={errorTextStyle}>{error}</h2>
      </div>
    );
  }

  return (
    <div className={displayStyle}>
      <img src={logo} alt="이사모음집 로고" className={logoStyle} onClick={toHome} />
      <div>
        <h2 className={explainTextStyle}>
          <span className="text-primary">{inviteData?.planTitle}</span> 이사 플랜의
          <br /> 새로운 <b className="text-secondary">Zipper</b>가 되어주세요!
        </h2>
        <h3 className={explain2TextStyle}>
          이제 <span className="text-primary">{inviteData?.inviterName}</span>님의 이사 플랜에 함께
          할 수 있습니다.
        </h3>
      </div>
      <button className={inviteButton} onClick={accpetInvitaion}>
        초대 수락하기
      </button>
    </div>
  );
}
