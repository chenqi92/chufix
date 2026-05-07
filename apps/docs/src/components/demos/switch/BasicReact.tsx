import { useState } from 'react';
import { Switch } from '@chukit/react';

export default function BasicReact() {
  const [wifi, setWifi] = useState(true);
  const [dnd, setDnd] = useState(false);
  const [sync, setSync] = useState(false);

  return (
    <div style={{ display: 'grid', gap: '0.85rem', maxWidth: '18rem' }}>
      <Switch checked={wifi} onChange={(e) => setWifi(e.target.checked)}>
        Wi-Fi {wifi ? '已开启' : '已关闭'}
      </Switch>
      <Switch
        size="sm"
        checked={dnd}
        onChange={(e) => setDnd(e.target.checked)}
      >
        勿扰模式（sm）
      </Switch>
      <Switch
        size="lg"
        checked={sync}
        onChange={(e) => setSync(e.target.checked)}
      >
        大尺寸（lg）
      </Switch>
      <Switch checked disabled>禁用 · 已开</Switch>
      <Switch checked={false} disabled>禁用 · 已关</Switch>
    </div>
  );
}
