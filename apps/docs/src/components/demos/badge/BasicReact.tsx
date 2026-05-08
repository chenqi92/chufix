import { Avatar, Badge, Button } from '@chukit/react';

export default function BasicReact() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Badge content="New" tone="primary" />
        <Badge content="3" tone="danger" />
        <Badge content="99+" tone="warning" />
        <Badge content="ok" tone="success" />
        <Badge dot tone="info" />
      </div>
      <div className="demo-row" style={{ gap: '1.5rem' }}>
        <Badge content={5}>
          <Button variant="outline">收件箱</Button>
        </Badge>
        <Badge content={120} max={99} tone="primary">
          <Button variant="outline">通知</Button>
        </Badge>
        <Badge dot tone="success">
          <Avatar name="Chen Qi" />
        </Badge>
        <Badge dot tone="warning" placement="bottom-right">
          <Avatar name="Anna Lee" />
        </Badge>
      </div>
    </div>
  );
}
