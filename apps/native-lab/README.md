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

## 네이티브 기능 확인

권한, 카메라, 사진 보관함, 공유 시트, 딥링크는 iOS 시뮬레이터·실기기와 Android 에뮬레이터·실기기에서 각각 확인한다. Expo Go보다 development build 또는 네이티브 실행 환경에서 custom scheme과 권한 동작을 확인하는 것이 정확하다.

```bash
pnpm --filter native-lab ios
pnpm --filter native-lab android

# 실행 중인 시뮬레이터/에뮬레이터에 딥링크 전달
xcrun simctl openurl booted 'nativelab://record/<record-id>'
adb shell am start -a android.intent.action.VIEW -d 'nativelab://record/<record-id>'
```

iOS는 사진 접근의 limited 상태와 sandbox URI를, Android는 `content://` 선택 URI·런타임 권한·system back을 별도로 확인한다. 앱은 선택한 파일을 양쪽 모두 Documents/attachments에 복사한 뒤 해당 URI를 SQLite에 저장한다.

## 검증

```bash
pnpm --filter native-lab build
pnpm --filter native-lab lint
pnpm --filter native-lab check-types
pnpm --filter native-lab test
```
