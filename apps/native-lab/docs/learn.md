# Native Lab 학습 기록

## Issue #6 — Expo 앱 골격

### 배운 내용

- Expo SDK 57 앱은 `expo-router/entry`를 앱 진입점으로 사용하고, `src/app` 아래 파일을 화면 route로 해석한다.
- pnpm 모노레포에서는 루트 `pnpm-workspace.yaml`에 `apps/*`가 포함되어 있으면 Expo 앱을 workspace 패키지로 관리할 수 있다.
- Expo의 최신 Metro는 pnpm 모노레포 구성을 기본 지원하므로, 첫 단계에서는 별도 Metro override를 추가하지 않는다.
- `expo export`는 네이티브 디바이스가 없어도 앱 번들 구성을 검증할 수 있는 CI 친화적인 build 단계다.

### 실행 명령

```bash
pnpm --filter native-lab dev
pnpm --filter native-lab build
pnpm --filter native-lab lint
pnpm --filter native-lab check-types
pnpm --filter native-lab test
```

### 다음 학습

- React Native 기본 컴포넌트와 화면 전환
- 기록 화면과 SQLite 저장소 연결

## Issue #7 — 기록 화면 흐름

### 배운 내용

- Expo Router의 `src/app` 파일 구조로 목록, 작성, 동적 상세 route를 구성할 수 있다.
- 화면 전환은 `router.push`, `router.replace`, `router.back`으로 의도를 구분한다.
- `KeyboardAvoidingView`와 `ScrollView`를 함께 사용하면 작성 화면에서 키보드가 입력 영역을 가리는 문제를 줄일 수 있다.
- 이 단계의 Context는 복잡한 전역 상태 관리가 아니라 화면 간 임시 기록 전달을 위한 경계다. 영구 저장은 다음 SQLite 단계에서 교체한다.

### 확인할 상태

- 기록 없음
- 제목 누락 validation
- 작성 중 취소
- 작성 완료 후 상세 이동
- 존재하지 않는 기록 ID로 상세 진입
