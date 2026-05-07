import { useState } from 'react';
import { Button } from '@chukit/react';

export default function BasicReact() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
  }

  return (
    <div className="demo-row">
      <Button onClick={() => setCount((c) => c + 1)}>点击 {count}</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button tone="danger">Danger</Button>
      <Button loading={loading} onClick={load}>
        {loading ? '加载中' : '点击加载'}
      </Button>
    </div>
  );
}
