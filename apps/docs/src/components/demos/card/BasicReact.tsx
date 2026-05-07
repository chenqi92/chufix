import { Card, CardHeader, CardBody, CardFooter, Button } from '@chukit/react';

export default function BasicReact() {
  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        width: '100%',
      }}
    >
      <Card variant="outlined">
        <CardHeader>Outlined</CardHeader>
        <CardBody>默认边框 + 微弱阴影，适合表单分组与设置面板。</CardBody>
        <CardFooter>
          <Button size="sm" variant="ghost">取消</Button>
          <Button size="sm">确认</Button>
        </CardFooter>
      </Card>

      <Card variant="elevated">
        <CardHeader>Elevated</CardHeader>
        <CardBody>去掉边框、提升阴影，适合卡片网格首页。</CardBody>
      </Card>

      <Card variant="filled" interactive onClick={() => alert('clicked')}>
        <CardHeader>Filled · 可点击</CardHeader>
        <CardBody>整张卡片作为入口，hover 上浮。</CardBody>
      </Card>
    </div>
  );
}
