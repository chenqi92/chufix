import { useContext, useMemo, useState } from 'react';
import { CfTreeView, CfTable, CfTag, CfSplitter, CfBreadcrumb } from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import {
  initialUsers,
  initialDepartments,
  collectDeptKeys,
  findDepartment,
  type AdminUser,
  type Department,
} from '../mock';

function toTreeNodes(list: Department[]): { key: string; label: string; children?: ReturnType<typeof toTreeNodes> }[] {
  return list.map((d) => ({
    key: d.key,
    label: d.label,
    children: d.children ? toTreeNodes(d.children) : undefined,
  }));
}

export default function Org() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const [selectedKey, setSelectedKey] = useState<string>('d-root');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['d-root', 'd-rnd', 'd-ops']);

  const treeNodes = useMemo(() => toTreeNodes(initialDepartments), []);
  const visibleUsers = useMemo<AdminUser[]>(() => {
    const dept = findDepartment(selectedKey);
    if (!dept) return initialUsers;
    const allowed = new Set(collectDeptKeys(dept));
    return initialUsers.filter((u) => u.deptKey && allowed.has(u.deptKey));
  }, [selectedKey]);

  const breadcrumb = useMemo(() => {
    const dept = findDepartment(selectedKey);
    return dept ? [{ label: dept.label }] : [];
  }, [selectedKey]);

  const cols = [
    { key: 'username', title: t.col_username, dataIndex: 'username', width: 120 },
    { key: 'name',     title: t.col_name,     dataIndex: 'name',     width: 140 },
    { key: 'email',    title: t.col_email,    dataIndex: 'email',    ellipsis: true },
    {
      key: 'deptKey', title: t.col_dept, dataIndex: 'deptKey', width: 160,
      render: (v: unknown) => {
        const dept = v ? findDepartment(String(v)) : null;
        return dept
          ? <CfTag size="sm" variant="soft" tone="primary">{dept.label}</CfTag>
          : '—';
      },
    },
    {
      key: 'status', title: t.status, dataIndex: 'status', width: 100,
      render: (v: unknown) =>
        <CfTag size="sm" tone={v === 'active' ? 'success' : 'danger'} variant="soft">
          {v === 'active' ? t.status_active : t.status_disabled}
        </CfTag>,
    },
  ];

  return (
    <div className="adm-page">
      {breadcrumb.length ? <CfBreadcrumb items={breadcrumb} /> : null}
      <p className="adm-page__hint">{t.org_select_hint}</p>

      <CfSplitter orientation="horizontal" defaultSize={30} unit="%" className="adm-org">
        <CfSplitter.Start>
          <div className="adm-org__tree">
            <CfTreeView
              nodes={treeNodes}
              selectable="single"
              selectedKey={selectedKey}
              onUpdateSelectedKey={(k) => setSelectedKey(k ?? 'd-root')}
              expandedKeys={expandedKeys}
              onUpdateExpandedKeys={setExpandedKeys}
              showLine
              size="sm"
            />
          </div>
        </CfSplitter.Start>
        <CfSplitter.End>
          <div className="adm-org__main">
            <div className="adm-org__count">
              {t.org_total.replace('{n}', String(visibleUsers.length))}
            </div>
            <CfTable
              columns={cols}
              rows={visibleUsers}
              rowKey={(r: AdminUser) => String(r.id)}
              size="sm"
              stickyHeader
              hoverable
            />
          </div>
        </CfSplitter.End>
      </CfSplitter>
    </div>
  );
}
