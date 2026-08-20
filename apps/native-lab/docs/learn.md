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

## Issue #9 — 카메라와 사진 보관함

### 배운 내용

- `expo-image-picker`의 `launchCameraAsync`와 `launchImageLibraryAsync`는 모두 `{ canceled, assets }` 결과를 반환한다.
- 권한 요청 전에 앱 기능에서 권한이 필요한 이유를 설명하고, 거부·재요청 가능·영구 거부를 구분해야 한다.
- iOS의 제한된 사진 접근은 오류가 아니라 `accessPrivileges: 'limited'`인 정상적인 접근 상태로 다룬다.
- 선택 결과의 URI는 즉시 사용할 수 있지만 영구 경로라고 가정하지 않고, 파일명·MIME type·크기를 별도 메타데이터로 정규화한다.
- 실제 앱 전용 파일 복사와 SQLite attachment 저장은 기록 생성 트랜잭션에서 연결하고, 목록 표시와 삭제 정합성은 다음 Issue에서 다룬다.

## Issue #10 — 문서 선택과 앱 전용 파일 저장

### 배운 내용

- `expo-document-picker`는 `copyToCacheDirectory: true`로 선택 직후 Expo FileSystem이 읽을 수 있는 임시 복사본을 제공한다. 이 복사본도 영구 저장 위치로 가정하지 않고 Documents 하위로 한 번 더 복사한다.
- 최신 Expo FileSystem은 legacy `copyAsync`, `makeDirectoryAsync` 대신 `File`, `Directory`, `Paths` 객체의 `copy`, `create`, `info` API를 사용한다.
- 파일 내용 전체를 base64나 `ArrayBuffer`로 JS 메모리에 올리지 않고 네이티브 파일 복사 API를 호출하면 큰 파일의 메모리 사용을 줄일 수 있다.
- iOS에서 선택 결과는 sandbox 밖의 원본 경로가 아니라 접근 가능한 임시 URI일 수 있고, Android에서는 `content://` URI가 들어올 수 있으므로 앱 Documents/attachments에 `file://` URI로 복사한 뒤 그 URI를 저장한다.
- 파일명은 경로 구분자를 제거하고 허용 문자만 남겨 destination path traversal과 충돌 가능성을 줄인다. 원래 파일명, MIME type, 크기, 확장자는 SQLite에 넣을 메타데이터로 정규화한다.
- 선택 취소는 기존 작성 상태를 바꾸지 않으며, 원본 URI 누락과 복사 실패는 파일 저장 기능의 오류 상태로 사용자에게 설명한다.

## Issue #11 — 기록 첨부파일 통합과 삭제 정합성

### 배운 내용

- 작성 화면의 첨부 상태를 단일 이미지가 아니라 `StoredAttachment[]`로 두면 사진과 문서를 같은 저장·표시 흐름으로 다룰 수 있다.
- 기록 생성과 attachment metadata INSERT는 SQLite transaction으로 묶어 부분 저장을 막고, transaction 실패 시 아직 DB에 연결되지 않은 앱 파일을 정리한다.
- 파일 시스템은 DB처럼 transaction을 제공하지 않으므로 기록 삭제는 연결된 파일을 먼저 삭제하고, 모든 파일 정리가 끝난 뒤 `ON DELETE CASCADE`로 SQLite 메타데이터를 삭제한다. 일부 파일 삭제가 실패하면 DB 삭제를 보류하고 사용자에게 재시도를 안내한다.
- DB에 URI가 남아 있어도 실제 파일은 수동 삭제나 OS 상태 변화로 사라질 수 있다. 상세 화면은 파일 존재 여부를 확인하고 복구 불가 상태와 재첨부 안내를 표시한다.

## Issue #12 — 첨부파일 OS 공유 시트

### 배운 내용

- `expo-sharing`은 `isAvailableAsync()`로 공유 API 사용 가능 여부를 먼저 확인한 뒤 `shareAsync(uri, options)`를 호출한다.
- Android는 Intent에 MIME type과 대화상자 제목을 전달하고, iOS는 UTI를 전달하므로 공통 URI 외의 공유 옵션은 플랫폼별로 분기한다.
- 공유 API의 `void` 결과는 사용자가 시트를 닫았는지와 실제 대상 앱이 파일을 처리했는지를 구분하지 않는다. 이 단계에서는 공유 시트 호출 성공과 API 실패·파일 누락만 앱 상태로 구분한다.
- 공유 불가 환경, 파일 누락, 공유 시트 실행 실패를 첨부파일 단위 오류로 표시해 기록 전체 화면의 오류로 확산하지 않는다.
