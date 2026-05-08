import { useState } from 'react';
import { Textarea } from '@chukit/react';

export default function BasicReact() {
  const [note, setNote] = useState('');
  const [bio, setBio] = useState('一个简短的自我介绍。');

  return (
    <div className="demo-stack">
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="说点什么…"
        rows={3}
        maxLength={120}
        showCount
      />
      <Textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        variant="filled"
        autoResize
        placeholder="自动撑高的多行输入"
      />
    </div>
  );
}
