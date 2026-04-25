---
description: React 타입은 네임스페이스가 아닌 named import로 사용
---

React 타입을 사용할 때 `React.ComponentProps`, `React.ReactNode` 등 네임스페이스 방식을 사용하지 말 것.
반드시 `import type { ComponentProps, ReactNode } from 'react'` 형태로 named import해서 사용할 것.

나쁜 예:

```tsx
import React from 'react';
function Foo(props: React.ComponentProps<'div'>) {}
```

좋은 예:

```tsx
import type { ComponentProps } from 'react';
function Foo(props: ComponentProps<'div'>) {}
```
