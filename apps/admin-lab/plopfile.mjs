export default function (plop) {
  plop.setGenerator('fsd-slice', {
    description: 'FSD 계층별 맞춤형 구조 생성',
    prompts: [
      {
        type: 'list',
        name: 'layer',
        message: '어느 레이어에 생성할까요?',
        choices: ['shared', 'entities', 'features', 'widgets', 'pages'],
      },
      {
        type: 'input',
        name: 'name',
        message: answers =>
          answers.layer === 'shared'
            ? '세그먼트/컴포넌트 이름을 입력하세요:'
            : '슬라이스 이름을 입력하세요:',
      },
    ],
    actions: data => {
      const actions = [];

      // 1. Shared 또는 Pages인 경우 (2단 구조)
      if (data.layer === 'shared' || data.layer === 'pages') {
        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{kebabCase name}}/index.ts',
          template: "export * from './ui';",
        });
        actions.push({
          type: 'add',
          path: 'src/{{layer}}/{{kebabCase name}}/ui/index.tsx',
          template:
            'export const {{pascalCase name}} = () => {\n  return <div>{{pascalCase name}}</div>;\n};',
        });
      }
      // 2. Entities, Features, Widgets인 경우 (3단 구조)
      else {
        actions.push(
          {
            type: 'add',
            path: 'src/{{layer}}/{{kebabCase name}}/ui/{{pascalCase name}}.tsx',
            template:
              'export const {{pascalCase name}} = () => {\n  return <div>{{pascalCase name}}</div>;\n};',
          },
          {
            type: 'add',
            path: 'src/{{layer}}/{{kebabCase name}}/model/index.ts',
            template: '// 비즈니스 로직 및 상태 관리',
          },
          {
            type: 'add',
            path: 'src/{{layer}}/{{kebabCase name}}/api/index.ts',
            template: '// API 요청 함수',
          },
          {
            type: 'add',
            path: 'src/{{layer}}/{{kebabCase name}}/index.ts',
            template: "export * from './ui/{{pascalCase name}}';",
          }
        );
      }

      return actions;
    },
  });
}
