import { useState } from 'react';
import {
  CfButton,
  CfDataGrid,
  CfAvatar,
  CfTag,
  CfInput,
  CfSelect,
  CfDropdown,
  CfIconButton,
} from '@chufix/react';

const roleOptions = [
  { label: 'Owner', value: 'owner' },
  { label: 'Admin', value: 'admin' },
  { label: 'Member', value: 'member' },
  { label: 'Viewer', value: 'viewer' },
];

const cols = [
  { key: 'user', title: '成员', dataIndex: 'user' },
  { key: 'role', title: '角色', dataIndex: 'role', width: 110 },
  { key: 'status', title: '状态', dataIndex: 'status', width: 110 },
  { key: 'joined', title: '加入', dataIndex: 'joined', width: 120 },
  { key: 'actions', title: '', dataIndex: 'actions', width: 60 },
];
const rows = [
  { id: '1', name: 'Jane Liu', email: 'jane.l@example.com', avatar: 'JL', role: 'owner', status: 'active', joined: '2024-03-12' },
  { id: '2', name: 'Bob Lin', email: 'bob@example.com', avatar: 'BL', role: 'admin', status: 'active', joined: '2024-04-08' },
  { id: '3', name: 'Alice Chen', email: 'alice@example.com', avatar: 'AC', role: 'member', status: 'active', joined: '2024-09-22' },
  { id: '4', name: 'Tim Wong', email: 'tim@example.com', avatar: 'TW', role: 'member', status: 'pending', joined: '—' },
  { id: '5', name: 'Sue Zhang', email: 'sue@example.com', avatar: 'SZ', role: 'viewer', status: 'active', joined: '2025-02-14' },
];

const memberActions = [
  { label: '修改角色', value: 'role' },
  { label: '重发邀请', value: 'resend' },
  { separator: true },
  { label: '移除成员', value: 'remove', danger: true },
];

export function TeamSettings() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  const invite = () => {
    if (!inviteEmail) return;
    alert(`邀请 ${inviteEmail} 作为 ${inviteRole}`);
    setInviteEmail('');
  };

  return (
    <div className="team">
      <header className="team__head">
        <h2>团队成员</h2>
        <p>{rows.length} 个成员 · {rows.filter((r) => r.status === 'pending').length} 个待加入</p>
      </header>

      <section className="team__invite">
        <CfInput value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="输入邮箱邀请新成员…" />
        <CfSelect value={inviteRole} onChange={setInviteRole as any} options={roleOptions} />
        <CfButton variant="primary" disabled={!inviteEmail} onClick={invite}>邀请</CfButton>
      </section>

      <section className="team__list">
        <CfDataGrid columns={cols} rows={rows} />
      </section>
    </div>
  );
}
