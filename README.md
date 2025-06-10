# HR Admin - HR-MATE 플랫폼 관리자 대시보드

이 프로젝트는 HR-MATE 플랫폼의 관리자 기능을 제공하는 프론트엔드 애플리케이션입니다. Next.js를 사용하여 개발되었으며, 직원 정보, 근태, 급여 등 다양한 HR 관련 데이터를 관리할 수 있는 웹 대시보드를 제공합니다.

## ✨ 주요 기능 (현재 및 예정)

- **사용자 인증:** 관리자 계정 로그인 및 로그아웃
- **대시보드:** 로그인 후 진입하는 기본 페이지
- **직원 관리:** 직원 정보 CRUD (예정)
- **근태 관리:** 출퇴근 기록 관리 (예정)
- **급여 관리:** 급여 정보 관리 (예정)

## 🛠️ 기술 스택

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **API Communication:** [Axios](https://axios-http.com/)

## 🚀 시작하기

### 사전 요구사항

- [Node.js](https://nodejs.org/en/) (v18.x 이상 권장)
- `npm`

### 1. 종속성 설치

프로젝트 루트 디렉터리에서 다음 명령어를 실행하여 필요한 패키지를 설치합니다.

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트 디렉터리에 `.env.local` 파일을 생성하고, 백엔드 API 서버의 주소를 입력합니다.

```env
# 백엔드 API 서버 주소
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. 개발 서버 실행

```bash
npm run dev
```

이제 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 📁 폴더 구조

```
HR_Admin/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── dashboard/      # 대시보드 페이지
│   │   ├── layout.tsx      # 루트 레이아웃
│   │   └── page.tsx        # 로그인 페이지
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   └── ui/             # shadcn/ui 컴포넌트
│   ├── hooks/              # 커스텀 훅 (생성됨)
│   ├── lib/                # 유틸리티 및 라이브러리 (api.ts, utils.ts)
│   ├── services/           # API 서비스 로직 (생성됨)
│   ├── store/              # 전역 상태 관리 (생성됨)
│   └── types/              # TypeScript 타입 정의 (생성됨)
├── public/                 # 정적 에셋 (이미지, 폰트)
└── ...                     # 기타 설정 파일 (tailwind.config.ts, tsconfig.json 등)
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
