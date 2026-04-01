# 꾸무 (ggumu)

나만의 루틴을 만들고 공유하는 서비스의 프론트엔드 레포지토리입니다.

## Tech Stack

- React 19 + TypeScript
- React Router v6
- Axios
- Zustand
- Tailwind CSS v3

## Getting Started

```bash
npm install
```

`.env.local` 파일을 생성하고 환경변수를 설정합니다:

```
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_KAKAO_LOGIN_URL=http://localhost:8080/oauth2/authorization/kakao
```

```bash
npm start   # 개발 서버 실행 (http://localhost:3000)
npm run build   # 프로덕션 빌드
npm test    # 테스트 실행
```

## Branch Strategy

- `main` — 프로덕션 브랜치 (CD 연동 예정, 직접 커밋 금지)
- `dev` — 개발 통합 브랜치