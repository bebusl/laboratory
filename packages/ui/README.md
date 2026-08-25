# @brillbe/ui

`@brillbe/ui`는 앱에서 사용하는 UI 컴포넌트와 디자인 토큰을 한 곳에서 소유하기 위한 개인 UI library입니다.

## 방향

이 패키지는 처음부터 모든 컴포넌트를 직접 구현하는 것을 목표로 하지 않습니다.

- 앱은 `@mui/material`이나 Radix를 직접 import하지 않고 `@brillbe/ui`만 사용합니다.
- 당장 필요한 복잡한 컴포넌트는 adapter 내부에서 MUI 또는 Radix를 사용할 수 있습니다.
- `Button`, `Input`, `Field`처럼 기본이 되는 컴포넌트는 직접 구현하며 Sass로 스타일을 관리합니다.
- adapter 구현은 컴포넌트별로 점진적으로 직접 구현으로 교체합니다.
- 외부 library의 타입과 styling API(`sx`, `slotProps` 등)는 앱 코드로 새지 않도록 합니다.

최종적으로는 다음 레이어를 지향합니다.

```text
앱
└── @brillbe/ui의 공개 API
    ├── 직접 구현한 컴포넌트 + Sass
    ├── Radix primitive + Sass (임시 동작 구현)
    └── MUI adapter (임시 구현 또는 전문 컴포넌트)
```

Radix primitive는 접근성, focus 관리, 키보드 상호작용이 복잡한 컴포넌트의 참고 구현 또는 중간 구현으로 사용합니다. 시각 스타일은 `@brillbe/ui`가 소유합니다.

## 현재 컴포넌트

| 컴포넌트                        | 구현               | 상태                       |
| ------------------------------- | ------------------ | -------------------------- |
| `Button`                        | native HTML + Sass | 직접 구현 시작             |
| `Input`                         | native HTML + Sass | 사용 가능                  |
| `Field`                         | native HTML + Sass | 사용 가능                  |
| `Dialog` / `Popover` / `Select` | 미정               | 필요할 때 adapter부터 추가 |

## 사용법

앱에서는 패키지의 공개 진입점에서 import합니다.

```tsx
import { Button, Field, FieldLabel, Input } from '@brillbe/ui';

export function ProfileForm() {
  return (
    <Field>
      <FieldLabel htmlFor="name">이름</FieldLabel>
      <Input id="name" />
      <Button type="submit">저장</Button>
    </Field>
  );
}
```

새 컴포넌트를 추가할 때는 외부 library의 API를 그대로 노출하기보다 `@brillbe/ui`의 목적에 맞는 최소 API를 정의합니다.

```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};
```

## 스타일링 규칙

- 컴포넌트 스타일은 `*.module.scss`에 작성합니다.
- Sass 변수와 mixin은 `styles/_variables.scss`, `styles/_mixins.scss`에 추가합니다.
- 컴포넌트의 의미 있는 상태는 class보다 `data-*` attribute를 우선 고려합니다.
- focus, disabled, invalid, reduced motion 등 기능 상태 스타일을 함께 정의합니다.
- 색상과 theme처럼 런타임에 바뀔 수 있는 값은 이후 CSS custom properties로 확장할 수 있도록 semantic token으로 관리합니다.
- Sass의 모듈 시스템은 `@use`, `@forward`를 사용합니다.

## 디렉터리 구조

```text
packages/ui/
├── button/
│   ├── Button.tsx
│   ├── Button.module.scss
│   └── Button.stories.tsx
├── field/
├── input/
├── styles/
│   ├── _mixins.scss
│   ├── _variables.scss
│   └── index.scss
├── index.ts                 # 공개 API
└── README.md
```

복잡한 외부 구현을 임시로 사용할 때는 앱에서 직접 노출하지 않고 해당 컴포넌트 폴더 안에서 adapter로 감쌉니다.

```text
dialog/
├── Dialog.tsx               # 공개 API와 최종 구현 위치
├── Dialog.module.scss
├── Dialog.stories.tsx
└── adapters/
    ├── Dialog.radix.tsx
    └── Dialog.mui.tsx
```

## 개발

저장소 루트에서 실행합니다.

```bash
pnpm storybook
pnpm storybook:build
pnpm --filter @brillbe/ui lint
pnpm --filter @brillbe/ui test
```

Storybook story는 컴포넌트의 API, 시각 상태, 접근성 동작을 확인하는 테스트 표면으로 사용합니다.

## 구현 순서

1. native HTML 기반의 `Button`, `Input`, `Field`
2. `Checkbox`, `Switch`, `Tabs`
3. `Dialog`, `Popover`, `Tooltip`
4. `Select`, `Combobox`, `DatePicker`처럼 상호작용이 복잡한 컴포넌트

각 컴포넌트는 구현 전에 키보드 동작, focus 이동, ARIA 관계, controlled/uncontrolled 여부를 먼저 정리합니다.
