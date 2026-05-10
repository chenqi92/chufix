#!/usr/bin/env node
/**
 * 把 packages/* 下所有非 private 包临时改 scope 后发布到 GitHub Packages。
 *
 * 规则：
 *   - 包名 @chufix/<x>     → @<owner>/chufix-<x>
 *   - 内部依赖 @chufix/<y>  → @<owner>/chufix-<y>（同步重写，避免 cross-registry）
 *   - publishConfig.registry 移除（让 npm 用环境里的 registry-url）
 *   - 已存在的版本会跳过（404 / 409 时不报错）
 *
 * 由 .github/workflows/release.yml 调用。也可本地用：
 *   GH_OWNER=chenqi92 NODE_AUTH_TOKEN=$GITHUB_TOKEN node scripts/publish-github-packages.mjs
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const owner = process.env.GH_OWNER;
if (!owner) {
  console.error('GH_OWNER is required');
  process.exit(1);
}

const root = path.resolve(process.cwd(), 'packages');
const dirs = (await fs.readdir(root, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

function rewriteName(name) {
  if (!name.startsWith('@chufix/')) return name;
  const flat = name.slice('@chufix/'.length);
  return `@${owner}/chufix-${flat}`;
}

function rewriteDeps(deps) {
  if (!deps) return;
  for (const k of Object.keys(deps)) {
    if (k.startsWith('@chufix/')) {
      const v = deps[k];
      const newKey = rewriteName(k);
      deps[newKey] = v;
      delete deps[k];
    }
  }
}

let publishedAny = false;
for (const d of dirs) {
  const dir = path.join(root, d);
  const pkgPath = path.join(dir, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  } catch {
    continue;
  }
  if (pkg.private) {
    console.log(`(skip) ${pkg.name} is private`);
    continue;
  }

  const original = JSON.stringify(pkg, null, 2);
  pkg.name = rewriteName(pkg.name);
  rewriteDeps(pkg.dependencies);
  rewriteDeps(pkg.peerDependencies);
  rewriteDeps(pkg.optionalDependencies);
  if (pkg.publishConfig) {
    delete pkg.publishConfig.registry;
  }

  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`→ publishing ${pkg.name}@${pkg.version}`);
  const res = spawnSync(
    'npm',
    ['publish', '--registry', 'https://npm.pkg.github.com', '--access', 'public'],
    { cwd: dir, stdio: 'inherit', env: process.env },
  );
  // 把 package.json 还原，避免污染下一步
  await fs.writeFile(pkgPath, original);

  if (res.status !== 0) {
    // 已经发过同版本号会返回非 0；这里把它当作成功跳过
    const out = (res.stderr ?? '').toString() + (res.stdout ?? '').toString();
    if (out.includes('cannot publish over the previously published')) {
      console.log(`  ↑ already published, skipping`);
      continue;
    }
    console.error(`  ✗ publish failed for ${pkg.name}`);
    process.exit(res.status ?? 1);
  }
  publishedAny = true;
}

if (!publishedAny) {
  console.log('no new versions to publish');
}
