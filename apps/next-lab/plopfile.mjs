export default function configurePlop(plop) {
  plop.setGenerator('lab', {
    description: '독립적인 Next Lab route와 구현 경계를 생성',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Lab 이름을 입력하세요:',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/app/{{kebabCase name}}/page.tsx',
        template:
          "import { {{pascalCase name}}Lab } from '@/labs/{{kebabCase name}}/ui/{{pascalCase name}}Lab';\n\nexport default {{pascalCase name}}Lab;\n",
      },
      {
        type: 'add',
        path: 'src/labs/{{kebabCase name}}/ui/{{pascalCase name}}Lab.tsx',
        template:
          "export function {{pascalCase name}}Lab() {\n  return <main>{{pascalCase name}} Lab</main>;\n}\n",
      },
      {
        type: 'add',
        path: 'src/labs/{{kebabCase name}}/model/index.ts',
        template: 'export {};\n',
      },
      {
        type: 'add',
        path: 'src/labs/{{kebabCase name}}/api/index.ts',
        template: 'export {};\n',
      },
      {
        type: 'add',
        path: 'src/labs/{{kebabCase name}}/lib/index.ts',
        template: 'export {};\n',
      },
    ],
  });
}
