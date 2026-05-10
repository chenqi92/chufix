import { useState } from 'react';
import { CfSqlWorkbench, CfCodeEditor } from '@chufix-design/react';

export function SqlWorkbench() {
  const [sql, setSql] = useState("SELECT id, name FROM users WHERE created_at > now() - interval '1 day';");

  return (
    <div style={{ height: 320 }}>
      <CfSqlWorkbench
        slots={{
          'panel-editor': <CfCodeEditor value={sql} onChange={setSql} language="sql" rows={10} />,
          'panel-console': <p style={{ color: 'var(--fg-2)' }}>交互式 SQL REPL（基于 CfCodeEditor + CfDataGrid 结果展示）。</p>,
          'panel-history': <p style={{ color: 'var(--fg-2)' }}>查询历史侧栏。</p>,
        }}
      />
    </div>
  );
}
