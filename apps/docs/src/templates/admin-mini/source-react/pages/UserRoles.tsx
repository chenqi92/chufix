import { useContext, useState } from 'react';
import { CfTable, CfTag, CfButton, CfModal, CfCheckbox } from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import {
  initialUsers,
  initialRoles,
  initialUserRoles,
  type AdminUser,
  type UserRoleLink,
} from '../mock';

export default function UserRoles() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const [links, setLinks] = useState<UserRoleLink[]>(
    initialUserRoles.map((l) => ({ ...l, roleIds: [...l.roleIds] })),
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [draft, setDraft] = useState<Set<string>>(new Set());

  function rolesFor(userId: number): string[] {
    return links.find((l) => l.userId === userId)?.roleIds ?? [];
  }
  function roleName(id: string): string {
    return initialRoles.find((r) => r.id === id)?.name ?? id;
  }
  function openAssign(u: AdminUser) {
    setEditing(u);
    setDraft(new Set(rolesFor(u.id)));
    setOpen(true);
  }
  function toggleRole(roleId: string) {
    setDraft((prev) => {
      const next = new Set(prev);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  }
  function saveAssign() {
    if (!editing) return;
    const uid = editing.id;
    const next = [...draft];
    setLinks((ls) =>
      ls.some((l) => l.userId === uid)
        ? ls.map((l) => (l.userId === uid ? { ...l, roleIds: next } : l))
        : [...ls, { userId: uid, roleIds: next }],
    );
    setOpen(false);
  }

  const cols = [
    { key: 'username', title: t.col_username, dataIndex: 'username', width: 110 },
    { key: 'name', title: t.col_name, dataIndex: 'name', width: 140 },
    {
      key: 'roles', title: t.col_user_roles, dataIndex: 'id',
      render: (v: unknown) => {
        const ids = rolesFor(v as number);
        if (!ids.length) return <span style={{ color: 'var(--fg-3)' }}>—</span>;
        return (
          <div style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' }}>
            {ids.map((id) => (
              <CfTag key={id} size="sm" variant="soft" tone="primary">{roleName(id)}</CfTag>
            ))}
          </div>
        );
      },
    },
    {
      key: 'assign', title: t.col_assign, dataIndex: 'id', width: 110, align: 'right' as const,
      render: (_v: unknown, row: AdminUser) =>
        <CfButton size="sm" variant="tertiary" onClick={() => openAssign(row)}>{t.edit}</CfButton>,
    },
  ];

  return (
    <div className="adm-page">
      <CfTable columns={cols} rows={initialUsers} rowKey={(r: AdminUser) => String(r.id)} size="sm" />
      <CfModal
        open={open}
        onUpdateOpen={setOpen}
        title={editing ? `${editing.name} · ${t.col_assign}` : t.col_assign}
        okText={t.save}
        cancelText={t.cancel}
        onBeforeOk={() => { saveAssign(); return true; }}
        size="sm"
      >
        <div className="adm-assign">
          {initialRoles.map((r) => (
            <label key={r.id} className="adm-assign__row">
              <CfCheckbox modelValue={draft.has(r.id)} onUpdateModelValue={() => toggleRole(r.id)} />
              <span className="adm-assign__name">{r.name}</span>
              <span className="adm-assign__desc">{r.description}</span>
            </label>
          ))}
        </div>
      </CfModal>
    </div>
  );
}
