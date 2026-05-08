import { Avatar, AvatarGroup } from '@chukit/react';

export default function BasicReact() {
  return (
    <div className="demo-stack">
      <div className="demo-row" style={{ alignItems: 'flex-end' }}>
        <Avatar size="xs" name="Chen Qi" />
        <Avatar size="sm" name="Chen Qi" />
        <Avatar size="md" name="Chen Qi" />
        <Avatar size="lg" name="Chen Qi" />
        <Avatar size="xl" name="Chen Qi" />
      </div>
      <div className="demo-row">
        <Avatar name="Anna Lee" />
        <Avatar name="Bob Smith" shape="square" />
        <Avatar src="https://i.pravatar.cc/80?img=12" alt="头像" />
        <Avatar src="https://example.com/__broken__.png" name="Fallback Test" />
        <Avatar fallback="?" />
      </div>
      <AvatarGroup>
        <Avatar name="Chen Qi" />
        <Avatar name="Anna Lee" />
        <Avatar name="Bob Smith" />
        <Avatar fallback="+5" />
      </AvatarGroup>
    </div>
  );
}
