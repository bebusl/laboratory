# Native Lab 작업지침

## 범위

- 이 규칙은 `apps/native-lab`과 그 하위 경로에만 적용한다.
- 다른 앱이나 패키지의 변경은 작업 Issue에 명시된 경우에만 수행한다.
- 구현 전 `apps/native-lab/docs/native-lab.md`와 현재 Issue를 확인한다.

## Expo

- 현재 앱은 Expo SDK 57을 기준으로 한다.
- API가 불확실하면 [Expo SDK 57 공식 문서](https://docs.expo.dev/versions/v57.0.0/)와 React Native 공식 문서를 먼저 확인한다.
- deprecated API와 legacy 패턴을 사용하지 않는다.
- 네이티브 기능과 플랫폼 차이는 학습 문서에 기록한다.

## 작업 방식

- Issue 하나를 기준으로 한 번에 하나의 작업만 처리한다.
- 브랜치명은 `native-lab-[issue-number]` 형식을 사용한다.
- 커밋 메시지는 `feat(native): message` 형식을 사용한다.
- 기존 변경사항을 임의로 수정하거나 커밋에 포함하지 않는다.
- 작업 완료 후 앱 단위 검증을 먼저 실행하고, 최종 단계에 루트 전체 검증을 실행한다.
