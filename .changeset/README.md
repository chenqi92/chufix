# Changesets

本目录由 [`@changesets/cli`](https://github.com/changesets/changesets) 管理 —— 它的作用是
让"什么时候发布、发哪个包、改大版本还是小版本"这件事**显式记录在代码里**，而不是
靠人脑或 commit message 推断。

## 工作流（开发者视角）

1. 开发完一个会影响公共包的改动，把代码 commit 上去。
2. 在仓库根目录跑：

   ```bash
   pnpm changeset
   ```

   它会问：
   - 这次改了哪些包（多选 `@chufix-design/vue` `@chufix-design/react` 等）
   - 各包是 patch / minor / major
   - 一句话说明（会进 CHANGELOG）

   生成一个 `.changeset/<random-name>.md` 文件 —— **commit 它**。

3. push 到 `main` 分支后：
   - GitHub Actions 上的 `release.yml` 会扫到所有未发布的 `.changeset/*.md`
   - 自动开一个 PR：标题是 `chore(release): version packages`，内容是升好版本号、合并好 CHANGELOG、删掉那些 `.md` 草稿
   - **合并那个 PR**，下一次 push 时 workflow 会自动跑 `pnpm publish`，发到 npm 和 GitHub Packages

## 没有 changeset 的 commit

只改了文档、测试、CI、内部 demo？**不需要 changeset**。workflow 看到没有 changeset 就直接跳过发布，不会乱升版本。

## 不发布的包

`apps/docs`、`examples/*` 都是 `private: true` 的工作区包，changesets 会自动忽略。
