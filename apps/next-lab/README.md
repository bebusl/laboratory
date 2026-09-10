# Next Lab

독립적인 Next.js 구현 실험을 모아두는 앱입니다. 각 주제는 `src/labs/<lab-name>` 아래에서 완결되며, `src/app`은 라우팅만 담당합니다.

## Development

```bash
pnpm dev
```

## Tests

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

E2E 테스트를 처음 실행하기 전 Chromium 브라우저를 설치합니다.

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

## Generate a Lab

```bash
pnpm plop lab
```

생성기는 route와 Lab의 `ui`, `model`, `api`, `lib` 경계만 만듭니다.
