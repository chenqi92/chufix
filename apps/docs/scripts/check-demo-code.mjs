import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../../..');
const docsRoot = path.join(repoRoot, 'apps/docs');
const srcRoot = path.join(docsRoot, 'src');

const MAX_ISSUES = 80;

function normalizeSlashes(value) {
  return value.replace(/\\/g, '/');
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (/\.(mdx|astro)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function lineAt(source, index) {
  return source.slice(0, index).split('\n').length;
}

function loadDocCodeModule() {
  const file = path.join(srcRoot, 'components/docCode.ts');
  const output = ts.transpileModule(readText(file), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const sandbox = {
    exports: {},
    module: { exports: {} },
    require,
    console,
  };
  sandbox.module.exports = sandbox.exports;
  vm.runInNewContext(output, sandbox, { filename: file });
  return sandbox.module.exports;
}

function findDemoFrames(source) {
  const frames = [];
  let index = 0;
  while (index < source.length) {
    const start = source.indexOf('<DemoFrame', index);
    if (start === -1) break;

    let i = start + '<DemoFrame'.length;
    let quote = '';
    let escaped = false;
    for (; i < source.length; i++) {
      const ch = source[i];
      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (ch === '\\') {
          escaped = true;
        } else if (ch === quote) {
          quote = '';
        }
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        quote = ch;
        continue;
      }
      if (ch === '>') {
        frames.push({
          start,
          attrs: source.slice(start + '<DemoFrame'.length, i),
        });
        index = i + 1;
        break;
      }
    }
    if (i >= source.length) break;
  }
  return frames;
}

function readTemplateAttribute(attrs, name) {
  const attr = new RegExp(`\\b${name}\\s*=\\s*\\{\\s*` + '`').exec(attrs);
  if (!attr) return undefined;
  let i = attr.index + attr[0].length;
  const start = i;
  let escaped = false;
  for (; i < attrs.length; i++) {
    const ch = attrs[i];
    if (escaped) {
      escaped = false;
    } else if (ch === '\\') {
      escaped = true;
    } else if (ch === '`') {
      return attrs.slice(start, i);
    }
  }
  return undefined;
}

function readExpressionAttribute(attrs, name) {
  const match = new RegExp(`\\b${name}\\s*=\\s*\\{\\s*([A-Za-z_$][\\w$]*)\\s*\\}`).exec(attrs);
  return match?.[1];
}

function resolveImport(file, specifier) {
  if (specifier.startsWith('~/')) return path.join(srcRoot, specifier.slice(2));
  if (specifier.startsWith('./') || specifier.startsWith('../')) return path.resolve(path.dirname(file), specifier);
  return undefined;
}

function rawImports(source, file) {
  const imports = new Map();
  const re = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)\?raw['"];?/g;
  for (const match of source.matchAll(re)) {
    const resolved = resolveImport(file, match[2]);
    if (resolved && fs.existsSync(resolved)) imports.set(match[1], readText(resolved));
  }
  return imports;
}

function diagnosticText(diagnostic) {
  return ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
}

function syntaxDiagnostics(code, filename) {
  const output = ts.transpileModule(code, {
    fileName: filename,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.ReactJSX,
      isolatedModules: true,
      esModuleInterop: true,
      skipLibCheck: true,
    },
  });
  return (output.diagnostics ?? [])
    .filter((item) => item.category === ts.DiagnosticCategory.Error)
    .map(diagnosticText);
}

function hasPlaceholder(source) {
  return /<Cf[A-Za-z0-9]+[^>]*(?:\s|=|\{|\[)\.\.\.(?:\s|\}|\]|>|\/>)/.test(source)
    || /slots=\{\{\s*\.\.\.\s*\}\}/.test(source)
    || /content=\{\s*\.\.\.\s*\}/.test(source)
    || /\[\s*\/\*\s*\.\.\.\s*\*\/\s*\]/.test(source)
    || /<Cf[A-Za-z0-9]+[^>]*>\s*(?:\.{3}|…)\s*<\/Cf[A-Za-z0-9]+>/.test(source);
}

function stateSettersWithoutState(source) {
  const names = new Set();
  for (const match of source.matchAll(/\bset[A-Z][A-Za-z0-9_]*\b/g)) {
    const name = match[0];
    const prev = source[(match.index ?? 0) - 1];
    if (prev === '.') continue;
    if (name === 'setTimeout' || name === 'setInterval' || name === 'setImmediate') continue;
    names.add(name);
  }
  return names;
}

function validateReactCode({ code, vueCode, id, issues, allowDynamic = false, checkSyntax = false }) {
  const add = (kind, detail) => issues.push({ kind, id, detail, sample: code.split('\n').slice(0, 12).join('\n') });

  if (!code.trim()) {
    add('empty-react', 'Generated React source is empty.');
    return;
  }

  if (hasPlaceholder(code)) {
    add('placeholder-react', 'React source still contains placeholder ellipsis.');
  }

  const searchableCode = code
    .replace(/`(?:\\.|[^`\\])*`/g, '')
    .replace(/"(?:\\.|[^"\\])*"/g, '')
    .replace(/'(?:\\.|[^'\\])*'/g, '');
  const vueResidue = [
    /from ['"]vue['"]/,
    /from ['"]@chufix-design\/vue['"]/,
    /\bref(?:<|\()/,
    /\bcomputed(?:<|\()/,
    /\breactive(?:<|\()/,
    /\bonMounted\b/,
    /\bwatch(?:Effect)?\(/,
  ].find((re) => re.test(searchableCode));
  if (vueResidue) {
    add('vue-residue', `React source matches ${vueResidue}.`);
  }

  if (/return\s*\(\s*<>\s*\n\s*(?:import|const|let|type|interface)\s+/.test(code)) {
    add('declaration-in-jsx', 'A declaration appears inside the returned JSX fragment.');
  }

  if (/style=\{[A-Za-z-]+:/.test(code)) {
    add('broken-style', 'JSX style object appears to have lost a brace.');
  }

  const setters = stateSettersWithoutState(code);
  if (setters.size && !/\buseState\b/.test(code)) {
    add('missing-use-state', `React state setter(s) referenced without useState: ${Array.from(setters).join(', ')}.`);
  }

  if (/\buseEffect\b/.test(code) && !/import\s+\{[^}]*useEffect/.test(code)) {
    add('missing-use-effect-import', 'useEffect is referenced without an import.');
  }

  const ratio = code.length / Math.max(1, vueCode.length);
  if (vueCode.length >= 300 && code.length > 0 && code.length < 160 && ratio < 0.45) {
    add('react-too-short', `React source is only ${(ratio * 100).toFixed(0)}% of the Vue source length.`);
  }

  if (checkSyntax && !allowDynamic) {
    const diagnostics = syntaxDiagnostics(code, id.endsWith('.jsx') ? 'Demo.jsx' : 'Demo.tsx');
    for (const diagnostic of diagnostics) add('syntax-error', diagnostic);
  }
}

function demoInputs(source, file, frame, imports) {
  const attrs = frame.attrs;
  const vueSourceAlias = readExpressionAttribute(attrs, 'vueSource');
  const reactSourceAlias = readExpressionAttribute(attrs, 'reactSource');
  const cliSourceAlias = readExpressionAttribute(attrs, 'cliSource');
  return {
    vueCode: readTemplateAttribute(attrs, 'vueCode'),
    reactCode: readTemplateAttribute(attrs, 'reactCode'),
    cliCode: readTemplateAttribute(attrs, 'cliCode'),
    vueSource: vueSourceAlias ? imports.get(vueSourceAlias) : undefined,
    reactSource: reactSourceAlias ? imports.get(reactSourceAlias) : undefined,
    cliSource: cliSourceAlias ? imports.get(cliSourceAlias) : undefined,
    id: `${normalizeSlashes(path.relative(repoRoot, file))}:${lineAt(source, frame.start)}`,
    allowDynamic: /\$\{/.test(frame.attrs),
  };
}

function checkDemoFrames(buildDemoCodeGroups) {
  const issues = [];
  const files = walk(srcRoot);

  for (const file of files) {
    const source = readText(file);
    if (!source.includes('<DemoFrame')) continue;
    const imports = rawImports(source, file);
    for (const frame of findDemoFrames(source)) {
      const input = demoInputs(source, file, frame, imports);
      let groups;
      try {
        groups = buildDemoCodeGroups(input);
      } catch (error) {
        issues.push({
          kind: 'generation-error',
          id: input.id,
          detail: error instanceof Error ? error.message : String(error),
          sample: frame.attrs.slice(0, 400),
        });
        continue;
      }

      const vueCode = groups.find((group) => group.framework === 'vue')?.files[0]?.content ?? '';
      const reactGroup = groups.find((group) => group.framework === 'react');
      if (!reactGroup) continue;

      for (const file of reactGroup.files.slice(0, 1)) {
        validateReactCode({
          code: file.content,
          vueCode,
          id: `${input.id} ${file.name}`,
          issues,
          allowDynamic: input.allowDynamic,
        });
      }
    }
  }

  return issues;
}

function fixtureVue(script, template = '<CfInput v-model="value" />') {
  return `<script setup lang="ts">
${script}
</script>

<template>
  ${template}
</template>`;
}

function checkFixtures(buildDemoCodeGroups) {
  const issues = [];
  const cases = [
    {
      name: 'typed multiline ref and value assignment',
      vueSource: fixtureVue(`
import { ref } from 'vue';
import { CfButton, CfInput } from '@chufix-design/vue';
const value = ref<string>(
  'hello',
);
function reset() { value.value = 'reset'; }
`, '<CfInput v-model="value" /><CfButton @click="reset">Reset</CfButton>'),
      mustContain: ['useState<string>', 'setValue'],
      mustNotContain: ['ref<string>', '.value'],
    },
    {
      name: 'computed list and value read',
      vueSource: fixtureVue(`
import { computed } from 'vue';
import { CfTable } from '@chufix-design/vue';
const rows = computed<{ id: string }[]>(() =>
  Array.from({ length: 3 }, (_, i) => ({ id: String(i) })),
);
function first() { return rows.value[0]?.id; }
`, '<CfTable :rows="rows" :columns="[]" />'),
      mustContain: ['const rows = Array.from'],
      mustNotContain: ['computed', '.value', ')),;'],
    },
    {
      name: 'reactive object',
      vueSource: fixtureVue(`
import { reactive } from 'vue';
import { CfCodeBlock } from '@chufix-design/vue';
const model = reactive({ a: 1, b: 2 });
`, '<CfCodeBlock :code="JSON.stringify(model)" />'),
      mustContain: ['const model = { a: 1, b: 2 }'],
      mustNotContain: ['reactive('],
    },
    {
      name: 'onMounted to useEffect',
      vueSource: fixtureVue(`
import { onMounted, ref } from 'vue';
import { CfSelect } from '@chufix-design/vue';
const loading = ref(true);
onMounted(() => {
  setTimeout(() => { loading.value = false; }, 10);
});
`, '<CfSelect :loading="loading" />'),
      mustContain: ['useEffect', 'setLoading(false)'],
      mustNotContain: ['onMounted', 'loading.value'],
    },
    {
      name: 'command-only react snippet falls back to vue source',
      vueSource: fixtureVue(`
import { CfButton, toast } from '@chufix-design/vue';
function notify() { toast.success('Saved'); }
`, '<CfButton @click="notify">Notify</CfButton>'),
      reactCode: `toast.success('Saved');`,
      mustContain: ['export default function Demo', '<CfButton'],
      mustNotContain: ['toast.success(\'Saved\');\n$'],
    },
    {
      name: 'jsx style braces survive',
      vueSource: fixtureVue(`
import { ref } from 'vue';
import { CfVariableAwareInput } from '@chufix-design/vue';
const value = ref('{{base_url}}/users');
const variables = ['base_url'];
`, '<div style="width: 100%; max-width: 920px;"><CfVariableAwareInput v-model="value" :variables="variables" /></div>'),
      mustContain: ['style={{ width: "100%", maxWidth: 920 }}'],
      mustNotContain: ['style={width:'],
    },
    {
      name: 'placeholder react snippet falls back',
      vueSource: fixtureVue(`
import { CfAreaChart } from '@chufix-design/vue';
const series = [{ name: 'A', data: [1, 2, 3] }];
`, '<CfAreaChart :series="series" />'),
      reactCode: '<CfAreaChart ... />',
      mustContain: ['const series = [{ name: \'A\', data: [1, 2, 3] }]', '<CfAreaChart series={series} />'],
      mustNotContain: ['<CfAreaChart ... />'],
    },
  ];

  for (const item of cases) {
    let code = '';
    try {
      const groups = buildDemoCodeGroups({
        vueSource: item.vueSource,
        reactCode: item.reactCode,
      });
      code = groups.find((group) => group.framework === 'react')?.files[0]?.content ?? '';
      validateReactCode({
        code,
        vueCode: item.vueSource,
        id: `fixture:${item.name}`,
        issues,
        checkSyntax: true,
      });
      for (const expected of item.mustContain ?? []) {
        if (!code.includes(expected)) {
          issues.push({
            kind: 'fixture-missing',
            id: `fixture:${item.name}`,
            detail: `Expected generated React to contain: ${expected}`,
            sample: code,
          });
        }
      }
      for (const forbidden of item.mustNotContain ?? []) {
        if (forbidden.endsWith('$')) {
          const re = new RegExp(forbidden);
          if (re.test(code)) {
            issues.push({
              kind: 'fixture-forbidden',
              id: `fixture:${item.name}`,
              detail: `Generated React matched forbidden pattern: ${forbidden}`,
              sample: code,
            });
          }
        } else if (code.includes(forbidden)) {
          issues.push({
            kind: 'fixture-forbidden',
            id: `fixture:${item.name}`,
            detail: `Generated React contains forbidden text: ${forbidden}`,
            sample: code,
          });
        }
      }
    } catch (error) {
      issues.push({
        kind: 'fixture-error',
        id: `fixture:${item.name}`,
        detail: error instanceof Error ? error.message : String(error),
        sample: code,
      });
    }
  }

  return issues;
}

function printIssues(issues) {
  for (const issue of issues.slice(0, MAX_ISSUES)) {
    console.error(`\n[${issue.kind}] ${issue.id}`);
    console.error(issue.detail);
    if (issue.sample) {
      console.error('--- sample ---');
      console.error(issue.sample.slice(0, 1200));
    }
  }
  if (issues.length > MAX_ISSUES) {
    console.error(`\n...and ${issues.length - MAX_ISSUES} more issue(s).`);
  }
}

const { buildDemoCodeGroups } = loadDocCodeModule();
const issues = [
  ...checkFixtures(buildDemoCodeGroups),
  ...checkDemoFrames(buildDemoCodeGroups),
];

if (issues.length) {
  console.error(`\nDemo code check failed with ${issues.length} issue(s).`);
  printIssues(issues);
  process.exit(1);
}

console.log('Demo code check passed.');
