# @chufix-design/cli

ChuFix UI CLI · 一键拉取 blocks 源码到本地项目。

## 使用

```bash
npx @chufix-design/cli list
npx @chufix-design/cli add billing-page
npx @chufix-design/cli add billing-page --out ./src/components/billing
```

## 自定义注册表

环境变量或参数：

```bash
CHUFIX_REGISTRY=http://localhost:4321/r npx @chufix-design/cli list
npx @chufix-design/cli add billing-page --registry http://localhost:4321/r
```

## 注册表协议

- `GET /r/index.json` → `{ blocks: [{ id, name, category, framework? }] }`
- `GET /r/<id>.json` → `{ id, files: [{ name, content, lang }] }`

文件以原文写入磁盘；`name` 即落地路径（相对 `--out`）。
