import { useState } from 'react';
import { Tag } from '@chukit/react';

export default function BasicReact() {
  const [tags, setTags] = useState(['Vue', 'Astro', 'Tailwind']);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Tag>Neutral</Tag>
        <Tag tone="primary">Primary</Tag>
        <Tag tone="success">Success</Tag>
        <Tag tone="warning">Warning</Tag>
        <Tag tone="danger">Danger</Tag>
        <Tag tone="info">Info</Tag>
      </div>
      <div className="demo-row">
        <Tag variant="solid" tone="primary">Solid</Tag>
        <Tag variant="soft" tone="primary">Soft</Tag>
        <Tag variant="outline" tone="primary">Outline</Tag>
        <Tag tone="success" rounded>圆角</Tag>
        <Tag size="sm" tone="info">sm</Tag>
        <Tag size="lg" tone="info">lg</Tag>
      </div>
      <div className="demo-row">
        {tags.map((t) => (
          <Tag
            key={t}
            tone="primary"
            closable
            onClose={() => setTags((xs) => xs.filter((x) => x !== t))}
          >
            {t}
          </Tag>
        ))}
        {!tags.length ? (
          <Tag variant="outline">没了，再点会回来</Tag>
        ) : null}
      </div>
    </div>
  );
}
