import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fetchRegistry, fetchBlock } from './registry.mjs';

const HELP = `chufix · ChuFix UI CLI

用法
  chufix add <block-id> [--out <dir>] [--registry <url>] [--force]
  chufix list [--registry <url>]
  chufix help

参数
  --out <dir>        目标目录，默认 ./src/blocks/<id>
  --registry <url>   注册表 URL，默认 https://chufix.com/r
  --force            目标目录已存在时仍然写入

示例
  chufix add billing-page
  chufix add login-basic --out ./components/login
  chufix list
`;

function parseArgs(argv) {
  const opts = { _: [], registry: process.env.CHUFIX_REGISTRY ?? 'https://chufix.com/r' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') opts.out = argv[++i];
    else if (a === '--registry') opts.registry = argv[++i];
    else if (a === '--force') opts.force = true;
    else if (a === '-h' || a === '--help') opts.help = true;
    else opts._.push(a);
  }
  return opts;
}

export async function run(argv) {
  const opts = parseArgs(argv);
  const cmd = opts._[0];

  if (!cmd || opts.help || cmd === 'help') {
    process.stdout.write(HELP);
    return;
  }

  if (cmd === 'list') {
    const reg = await fetchRegistry(opts.registry);
    const grouped = new Map();
    for (const b of reg.blocks) {
      const arr = grouped.get(b.category) ?? [];
      arr.push(b);
      grouped.set(b.category, arr);
    }
    for (const [cat, blocks] of grouped) {
      process.stdout.write(`\n  ${cat}\n`);
      for (const b of blocks) {
        process.stdout.write(`    ${b.id.padEnd(24)} ${b.name}\n`);
      }
    }
    process.stdout.write('\n');
    return;
  }

  if (cmd === 'add') {
    const id = opts._[1];
    if (!id) throw new Error('缺少 block id，例如 chufix add billing-page');

    const block = await fetchBlock(opts.registry, id);
    const out = path.resolve(opts.out ?? path.join('src/blocks', id));

    const exists = await fs.stat(out).then(() => true, () => false);
    if (exists && !opts.force) {
      throw new Error(`目录已存在：${out}\n使用 --force 覆盖，或换一个 --out`);
    }
    await fs.mkdir(out, { recursive: true });

    for (const f of block.files) {
      const target = path.join(out, f.name);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, f.content, 'utf8');
      process.stdout.write(`✓ ${path.relative(process.cwd(), target)}\n`);
    }
    process.stdout.write(`\n已写入 ${block.files.length} 个文件到 ${path.relative(process.cwd(), out) || '.'}\n`);
    const langs = new Set(block.files.map((f) => f.lang));
    const peers = ['@chufix/tokens'];
    if (langs.has('vue')) peers.push('@chufix/vue');
    if (langs.has('tsx')) peers.push('@chufix/react');
    process.stdout.write(`记得安装 peer 依赖：pnpm add ${peers.join(' ')}\n`);
    return;
  }

  throw new Error(`未知命令：${cmd}\n运行 chufix help 查看用法。`);
}
