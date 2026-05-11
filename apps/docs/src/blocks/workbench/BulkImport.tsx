import { useMemo, useState } from 'react';
import {
  CfButton,
  CfMetricCard,
  CfSpreadsheet,
  CfTag,
  modal,
  rangeToTSV,
  toA1,
  toast,
} from '@chufix-design/react';

interface RowError {
  row: number;
  col: string;
  message: string;
}

const HEADERS = ['name', 'email', 'role', 'amount'];
const COLS = HEADERS.length;
const ROWS = 12;

function seed(): Record<string, string> {
  const out: Record<string, string> = {};
  HEADERS.forEach((h, c) => {
    out[toA1(c, 0)] = h;
  });
  const sample = [
    ['Alice', 'alice@example.com', 'admin', '120'],
    ['Bob', 'bob@example.com', 'user', '88'],
    ['Charlie', 'charlie@', 'user', '60'],
    ['Dora', '', 'guest', '20'],
    ['', 'eli@example.com', 'user', '-5'],
  ];
  sample.forEach((row, r) => {
    row.forEach((cell, c) => {
      out[toA1(c, r + 1)] = cell;
    });
  });
  return out;
}

const ROLE_VALUES = new Set(['admin', 'user', 'guest']);

export function BulkImport() {
  const [data, setData] = useState<Record<string, string>>(seed);

  const rows = useMemo(() => {
    const out: Array<{ name: string; email: string; role: string; amount: string; rowIndex: number }> = [];
    for (let r = 1; r < ROWS; r++) {
      const obj: Record<string, string> = {};
      let any = false;
      HEADERS.forEach((h, c) => {
        const v = data[toA1(c, r)] ?? '';
        obj[h] = v;
        if (v.trim()) any = true;
      });
      if (any) {
        out.push({
          name: obj.name ?? '',
          email: obj.email ?? '',
          role: obj.role ?? '',
          amount: obj.amount ?? '',
          rowIndex: r + 1,
        });
      }
    }
    return out;
  }, [data]);

  const errors = useMemo<RowError[]>(() => {
    const out: RowError[] = [];
    for (const r of rows) {
      if (!r.name.trim()) out.push({ row: r.rowIndex, col: 'name', message: '姓名不能为空' });
      if (!r.email.trim()) out.push({ row: r.rowIndex, col: 'email', message: '邮箱不能为空' });
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email.trim())) out.push({ row: r.rowIndex, col: 'email', message: '邮箱格式不正确' });
      if (r.role && !ROLE_VALUES.has(r.role)) out.push({ row: r.rowIndex, col: 'role', message: `角色必须是 ${[...ROLE_VALUES].join('/')}` });
      const n = Number(r.amount);
      if (Number.isNaN(n) || n < 0) out.push({ row: r.rowIndex, col: 'amount', message: '金额必须是非负数' });
    }
    return out;
  }, [rows]);

  const validCount = useMemo(() => {
    const errored = new Set(errors.map((e) => e.row));
    return rows.filter((r) => !errored.has(r.rowIndex)).length;
  }, [rows, errors]);

  async function importAll() {
    if (errors.length) {
      toast({ type: 'error', message: `仍有 ${errors.length} 条错误，请先修复` });
      return;
    }
    const ok = await modal.confirm({
      title: `导入 ${rows.length} 行？`,
      description: '将作为一次提交写入用户表。',
      okText: '导入',
    });
    if (!ok) return;
    toast({ type: 'success', message: `已导入 ${rows.length} 行` });
  }

  async function exportTemplate() {
    const tsv = rangeToTSV(data, {
      start: { col: 0, row: 0 },
      end: { col: COLS - 1, row: 0 },
    });
    await navigator.clipboard.writeText(tsv);
    toast({ type: 'info', message: '表头已复制到剪贴板，可粘贴到 Excel/Sheets' });
  }

  function clearAll() {
    const next: Record<string, string> = {};
    HEADERS.forEach((h, c) => {
      next[toA1(c, 0)] = h;
    });
    setData(next);
    toast({ type: 'info', message: '已清空数据（保留表头）' });
  }

  return (
    <div className="bi">
      <header className="bi__head">
        <div>
          <h1 className="bi__title">批量导入用户</h1>
          <p className="bi__sub">
            <CfTag tone={errors.length ? 'error' : 'success'} size="sm">
              {errors.length ? `${errors.length} 处错误` : 'ready'}
            </CfTag>
            支持从 Excel / Sheets 直接 Cmd+V 粘贴
          </p>
        </div>
        <div className="bi__actions">
          <CfButton variant="tertiary" onClick={exportTemplate}>
            复制表头
          </CfButton>
          <CfButton variant="tertiary" onClick={clearAll}>
            清空
          </CfButton>
          <CfButton disabled={!rows.length || errors.length > 0} onClick={importAll}>
            导入 {rows.length} 行
          </CfButton>
        </div>
      </header>

      <div className="bi__kpis">
        <CfMetricCard label="待导入" value={rows.length} />
        <CfMetricCard label="可通过" value={validCount} trend="up" />
        <CfMetricCard label="错误" value={errors.length} trend={errors.length ? 'down' : undefined} />
      </div>

      <CfSpreadsheet
        modelValue={data}
        onChange={setData}
        rows={ROWS}
        cols={COLS}
        colWidth={160}
        caption="第一行是表头,从第二行起填数据"
      />

      {errors.length > 0 && (
        <div className="bi__errors">
          <h2 className="bi__errors-title">校验报告</h2>
          <ul className="bi__errors-list">
            {errors.map((e, i) => (
              <li key={i}>
                第 {e.row} 行 · <code>{e.col}</code> — {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
