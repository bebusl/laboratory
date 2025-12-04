# Laboratory - Mini Projects Monorepo

> 미니 프로젝트 연구소: 실험적인 아이디어와 재사용 가능한 컴포넌트를 관리하는 모노레포

## 개요

이 레포지토리는 다양한 미니 프로젝트와 공유 패키지를 효율적으로 관리하기 위한 Turborepo 기반 모노레포입니다.

## 구조

```
laboratory/
├── apps/              # 웹사이트형 애플리케이션
├── packages/          # 재사용 가능한 패키지
│   ├── ui/           # UI 컴포넌트 (@jinhee/ui)
│   └── config/       # 공통 설정 (@jinhee/config)
└── docs/             # 문서
```

## 시작하기

### 사전 요구사항

- Node.js 23 이상
- pnpm 10 이상

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발

```bash
# 모든 앱 개발 서버 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter @jinhee/rbac-demo dev
```

### 빌드

```bash
# 모든 프로젝트 빌드
pnpm build

# 특정 패키지만 빌드
pnpm --filter @jinhee/ui build
```

### 린트 & 포매팅

```bash
# 린트 실행
pnpm lint

# 포매팅
pnpm format
```

## 프로젝트 추가하기

### 웹사이트형 앱 추가

```bash
cd apps
pnpm create next-app@latest my-new-demo
cd my-new-demo
pnpm add @jinhee/ui @jinhee/auth --workspace
```

### 패키지 추가

```bash
cd packages
mkdir my-package
cd my-package
# package.json 설정 후
pnpm install
```

## 패키지

### Published Packages

- `@jinhee/ui` - UI 컴포넌트 라이브러리
- `@jinhee/auth` - 인증 관련 훅 및 가드
- `@jinhee/utils` - 공통 유틸리티
- `@jinhee/types` - TypeScript 타입 정의

### Internal Packages

- `@jinhee/config` - 공통 설정 파일 (TypeScript, ESLint, Prettier)

## 문서

자세한 아키텍처 및 가이드는 [docs/architecture.md](docs/architecture.md)를 참고하세요.

## 기술 스택

- [Turborepo](https://turbo.build/repo) - 모노레포 빌드 시스템
- [pnpm](https://pnpm.io/) - 패키지 매니저
- [Next.js](https://nextjs.org/) - React 프레임워크
- [TypeScript](https://www.typescriptlang.org/) - 타입 안전성
- [tsup](https://tsup.egoist.dev/) - TypeScript 번들러

## 라이선스

ISC

## 작성자

bebusl
