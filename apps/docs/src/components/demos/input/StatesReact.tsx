import { useState } from 'react';
import { Input } from '@chukit/react';

export default function StatesReact() {
  const [v, setV] = useState('outline 默认');
  const [f, setF] = useState('filled 变体');
  const [g, setG] = useState('ghost 下划线');
  const [e, setE] = useState('错误状态');

  return (
    <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '22rem' }}>
      <Input value={v} onChange={(ev) => setV(ev.target.value)} />
      <Input value={f} variant="filled" onChange={(ev) => setF(ev.target.value)} />
      <Input value={g} variant="ghost" onChange={(ev) => setG(ev.target.value)} />
      <Input value={e} error onChange={(ev) => setE(ev.target.value)} />
      <Input value="禁用" disabled readOnly />
      <Input inputSize="sm" placeholder="sm 尺寸" />
      <Input inputSize="lg" placeholder="lg 尺寸" />
    </div>
  );
}
