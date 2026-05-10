# @chufix-design/icons

ChuFix 的基础 SVG 图标包。图标使用 `16x16` viewBox、`currentColor`、线性描边，适合放在按钮、输入框、菜单、状态提示和技术产品界面里。

## 使用 sprite

```html
<svg width="16" height="16" aria-hidden="true">
  <use href="/path/to/icons.svg#search"></use>
</svg>
```

## 使用图标名 helper

```ts
import { getIconHref, iconNames, type IconName } from '@chufix-design/icons';

const name: IconName = 'search';
const href = getIconHref(name, '/assets/icons.svg');
```

## 同步源文件

根目录的 `icons.svg` 是当前设计稿仍在使用的源文件。更新它之后运行：

```bash
pnpm --filter @chufix-design/icons sync
```

脚本会同步 `src/icons.svg` 并重新生成 `src/names.ts`。
