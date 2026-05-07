import { useState } from 'react';
import { Input } from '@chukit/react';

export default function BasicReact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@chukit.dev');
  const [pwd, setPwd] = useState('');

  return (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '22rem' }}>
      <Input
        value={name}
        placeholder="请输入名字"
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        value={email}
        clearable
        placeholder="邮箱"
        onChange={(e) => setEmail(e.target.value)}
        onClear={() => setEmail('')}
      />
      <Input
        value={pwd}
        type="password"
        placeholder="密码"
        onChange={(e) => setPwd(e.target.value)}
      />
      <small style={{ color: 'hsl(var(--ck-muted-fg))' }}>
        name = {name || '空'}
      </small>
    </div>
  );
}
