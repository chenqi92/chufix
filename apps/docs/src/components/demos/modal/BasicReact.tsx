import { useState } from 'react';
import { Button, Modal, Input } from '@chukit/react';

export default function BasicReact() {
  const [open, setOpen] = useState(false);
  const [openLg, setOpenLg] = useState(false);
  const [name, setName] = useState('');

  function submit() {
    setOpen(false);
    alert(`React 提交：${name || '空'}`);
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button onClick={() => setOpen(true)}>打开 Modal</Button>
        <Button variant="outline" onClick={() => setOpenLg(true)}>
          大尺寸（lg）
        </Button>
      </div>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="新建项目"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={submit}>创建</Button>
          </>
        }
      >
        <p style={{ margin: '0 0 0.75rem 0' }}>
          填写项目名后回车或点击「创建」。试试 Tab、Shift+Tab、Esc。
        </p>
        <Input
          value={name}
          autoFocus
          placeholder="项目名"
          onChange={(e) => setName(e.target.value)}
        />
      </Modal>

      <Modal
        open={openLg}
        onOpenChange={setOpenLg}
        size="lg"
        title="大尺寸"
        footer={<Button onClick={() => setOpenLg(false)}>知道了</Button>}
      >
        <p>这个 Modal 用 <code>size="lg"</code>，最大宽度 640px。</p>
        <p style={{ color: 'hsl(var(--ck-muted-fg))' }}>
          点击遮罩或按 Esc 都能关掉，可以在 props 里关掉这两个行为。
        </p>
      </Modal>
    </>
  );
}
