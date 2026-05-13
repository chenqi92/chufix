import { useContext, useMemo, useState } from 'react';
import {
  CfTable,
  CfTag,
  CfButton,
  CfModal,
  CfForm,
  CfFormField,
  CfInput,
  CfSelect,
  CfSearchInput,
} from '@chufix-design/react';
import { DemoContext, STRINGS } from '../state';
import { initialUsers, type AdminUser } from '../mock';

type Draft = Pick<AdminUser, 'username' | 'name' | 'email' | 'phone' | 'status'>;

export default function Users() {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const [rows, setRows] = useState<AdminUser[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<Draft>({ username: '', name: '', email: '', phone: '', status: 'active' });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.username, r.name, r.email, r.phone].some((v) => v.toLowerCase().includes(q)),
    );
  }, [rows, search]);

  function openCreate() {
    setEditing(null);
    setForm({ username: '', name: '', email: '', phone: '', status: 'active' });
    setOpen(true);
  }
  function openEdit(row: AdminUser) {
    setEditing(row);
    setForm({ username: row.username, name: row.name, email: row.email, phone: row.phone, status: row.status });
    setOpen(true);
  }
  function remove(row: AdminUser) {
    setRows((rs) => rs.filter((r) => r.id !== row.id));
  }
  function save() {
    if (editing) {
      const id = editing.id;
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...form } : r)));
    } else {
      const nextId = (rows.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
      setRows((rs) => [
        ...rs,
        { id: nextId, ...form, createdAt: new Date().toISOString().slice(0, 16).replace('T', ' ') },
      ]);
    }
    setOpen(false);
  }

  const cols = [
    { key: 'id',        title: t.col_id,         dataIndex: 'id',        width: 60  },
    { key: 'username',  title: t.col_username,   dataIndex: 'username',  width: 110 },
    { key: 'name',      title: t.col_name,       dataIndex: 'name',      width: 140 },
    { key: 'email',     title: t.col_email,      dataIndex: 'email' },
    { key: 'phone',     title: t.col_phone,      dataIndex: 'phone',     width: 130 },
    {
      key: 'status', title: t.status, dataIndex: 'status', width: 90,
      render: (v: unknown) =>
        <CfTag size="sm" tone={v === 'active' ? 'success' : 'danger'} variant="soft">
          {v === 'active' ? t.status_active : t.status_disabled}
        </CfTag>,
    },
    { key: 'createdAt', title: t.col_created_at, dataIndex: 'createdAt', width: 160 },
    {
      key: 'actions', title: t.actions, dataIndex: 'id', width: 130, align: 'right' as const,
      render: (_v: unknown, row: AdminUser) =>
        <div style={{ display: 'inline-flex', gap: 4, justifyContent: 'flex-end' }}>
          <CfButton size="sm" variant="tertiary" onClick={() => openEdit(row)}>{t.edit}</CfButton>
          <CfButton size="sm" variant="danger" onClick={() => remove(row)}>{t.delete}</CfButton>
        </div>,
    },
  ];

  return (
    <div className="adm-page">
      <header className="adm-page__head">
        <div className="adm-page__head-left">
          <CfSearchInput modelValue={search} onUpdateModelValue={setSearch} placeholder={t.search} size="sm" style={{ width: 220 }} />
          <span className="adm-page__count">{t.total_rows.replace('{n}', String(filtered.length))}</span>
        </div>
        <CfButton variant="primary" size="sm" onClick={openCreate}>+ {t.create}</CfButton>
      </header>

      <CfTable columns={cols} rows={filtered} rowKey={(r: AdminUser) => String(r.id)} size="sm" />

      <CfModal
        open={open}
        onUpdateOpen={setOpen}
        title={editing ? t.edit : t.create}
        okText={t.save}
        cancelText={t.cancel}
        onBeforeOk={() => { save(); return true; }}
        size="md"
      >
        <CfForm model={form} layout="vertical">
          <CfFormField label={t.col_username} name="username">
            <CfInput modelValue={form.username} onUpdateModelValue={(v) => setForm({ ...form, username: v })} />
          </CfFormField>
          <CfFormField label={t.col_name} name="name">
            <CfInput modelValue={form.name} onUpdateModelValue={(v) => setForm({ ...form, name: v })} />
          </CfFormField>
          <CfFormField label={t.col_email} name="email">
            <CfInput modelValue={form.email} type="email" onUpdateModelValue={(v) => setForm({ ...form, email: v })} />
          </CfFormField>
          <CfFormField label={t.col_phone} name="phone">
            <CfInput modelValue={form.phone} onUpdateModelValue={(v) => setForm({ ...form, phone: v })} />
          </CfFormField>
          <CfFormField label={t.status} name="status">
            <CfSelect
              modelValue={form.status}
              onUpdateModelValue={(v) => setForm({ ...form, status: v as AdminUser['status'] })}
              options={[
                { value: 'active', label: t.status_active },
                { value: 'disabled', label: t.status_disabled },
              ]}
            />
          </CfFormField>
        </CfForm>
      </CfModal>
    </div>
  );
}
