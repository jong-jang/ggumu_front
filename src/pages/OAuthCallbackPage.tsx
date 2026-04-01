import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const isNewUser = params.get('is_new_user') === 'true';

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate(isNewUser ? '/onboarding' : '/home');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
}
