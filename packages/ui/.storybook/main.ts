import type { StorybookConfig } from '@storybook/react-vite';

import { dirname } from 'path';

import { fileURLToPath } from 'url';

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
const config: StorybookConfig = {
  stories: [
    '../{alert,avatar,badge,breadcrumb,button,card,checkbox,combobox,date-picker,dialog,dropdown-menu,empty-state,feedback,field,input,pagination,radio-group,select,separator,switch,table,tabs,textarea,toast,tooltip}/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../field/**/*.mdx',
  ],
  addons: [
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-vitest'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-docs'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
};
export default config;
