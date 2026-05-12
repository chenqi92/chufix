import { useContext, useMemo } from 'react';
import { CfTable } from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import { initialDict, type DictItem } from '../mock';

interface DictNode extends DictItem { children?: DictNode[] }

export default function Dict() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const tree = useMemo<DictNode[]>(() => {
    const byParent = new Map<string | null, DictItem[]>();
    for (const item of initialDict) {
      const arr = byParent.get(item.parentId) ?? [];
      arr.push(item);
      byParent.set(item.parentId, arr);
    }
    const roots = byParent.get(null) ?? [];
    return roots.map((r) => ({ ...r, children: byParent.get(r.id) ?? [] }));
  }, []);

  const cols = [
    { key: 'label',  title: t.col_dict_label,  dataIndex: 'label',  width: 220 },
    { key: 'value',  title: t.col_dict_value,  dataIndex: 'value',  width: 200 },
    { key: 'remark', title: t.col_dict_remark, dataIndex: 'remark' },
  ];

  return (
    <div className="adm-page">
      <CfTable
        columns={cols}
        rows={tree}
        rowKey={(r: DictNode) => r.id}
        defaultExpandedRowKeys={tree.map((n) => n.id)}
        size="sm"
      />
    </div>
  );
}
