import { Button, Toaster, toast } from '@chukit/react';

export default function BasicReact() {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Button
          onClick={() =>
            toast({ title: '通用通知', description: '这是一条默认 Toast。' })
          }
        >
          默认
        </Button>
        <Button
          tone="primary"
          onClick={() =>
            toast.success({ title: '保存成功', description: '配置已写入。' })
          }
        >
          success
        </Button>
        <Button
          tone="danger"
          onClick={() =>
            toast.error({ title: '保存失败', description: '请检查网络后重试。' })
          }
        >
          error
        </Button>
        <Button variant="outline" onClick={() => toast.warning('磁盘空间不足 10%')}>
          warning
        </Button>
        <Button variant="ghost" onClick={() => toast.info('已复制到剪贴板')}>
          info
        </Button>
      </div>
      <p className="demo-hint">
        右上角是 <code>Toaster</code> 渲染区，每条 Toast 默认 4s 自动关闭，点 × 可手动关闭。
      </p>
      <Toaster position="top-right" />
    </div>
  );
}
