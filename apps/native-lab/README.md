# Native Lab

사진·파일·메모를 남기는 현장 기록 앱으로 React Native 네이티브 기능을 학습한다.

## 시작하기

루트 디렉터리에서 의존성을 설치한 뒤 앱을 실행한다.

```bash
pnpm install
pnpm --filter native-lab dev
```

iOS 시뮬레이터 또는 실기기에서 실행하려면 다음 명령을 사용할 수 있다.

```bash
pnpm --filter native-lab ios
```

현재 화면은 앱 골격을 확인하기 위한 초기 화면이다. 카메라, 파일, SQLite, 공유, 딥링크, WebView 기능은 각각의 GitHub Issue에서 단계적으로 추가한다.

## 검증

```bash
pnpm --filter native-lab build
pnpm --filter native-lab lint
pnpm --filter native-lab check-types
pnpm --filter native-lab test
```
