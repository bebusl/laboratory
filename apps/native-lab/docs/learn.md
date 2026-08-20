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

## Issue #8 — SQLite 기록 저장소

### 배운 내용

- Expo SDK 57의 `SQLiteProvider`에서 `onInit`으로 migration을 실행하고, 하위 화면은 `useSQLiteContext`로 같은 DB 연결을 사용한다.
- 사용자 입력은 `runAsync`의 bound parameter로 전달하고, 여러 SQL 정의를 한 번에 실행하는 `execAsync`에는 사용자 값을 넣지 않는다.
- `records`와 `attachments`를 외래 키로 연결하고 `ON DELETE CASCADE`를 설정해 이후 파일 메타데이터 정리 흐름을 준비했다.
- 화면 Context는 DB를 대체하는 저장소가 아니라 로딩·오류·화면 갱신을 담당하는 얇은 경계로 남겼다.
- `native-lab.db`는 앱 전용 데이터베이스 파일이므로 앱 재실행 후에도 기록이 유지된다.
