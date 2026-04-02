import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    window.location.href = process.env.REACT_APP_KAKAO_LOGIN_URL!;
  };

  const handleDevLogin = () => {
    localStorage.setItem('access_token', 'dev-access-token');
    localStorage.setItem('refresh_token', 'dev-refresh-token');
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">꾸무</h1>
      <p className="text-gray-500 mb-12">나만의 루틴을 만들고 공유하세요</p>
      <button
        onClick={handleKakaoLogin}
        className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-medium text-lg"
      >
        카카오로 시작하기
      </button>
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={handleDevLogin}
          className="mt-4 text-sm text-gray-400 underline"
        >
          [개발] 로그인 건너뛰기
        </button>
      )}
    </div>
  );
}
