import { useState } from 'react';
import { Select, type SelectOption } from '@chukit/react';

const options: SelectOption[] = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'chengdu', label: '成都（暂不可选）', disabled: true },
];

export default function BasicReact() {
  const [city, setCity] = useState<string | null>('shanghai');
  const [empty, setEmpty] = useState<string | null>(null);

  return (
    <div className="demo-stack">
      <Select
        value={city}
        options={options}
        placeholder="选一个城市"
        clearable
        onChange={(v) => setCity(v as string | null)}
      />
      <p className="demo-hint">
        已选：<code>{city ?? 'null'}</code>
      </p>

      <div className="demo-row">
        <Select
          value={empty}
          options={options}
          size="sm"
          placeholder="sm"
          onChange={(v) => setEmpty(v as string | null)}
        />
        <Select
          value={empty}
          options={options}
          size="lg"
          placeholder="lg"
          onChange={(v) => setEmpty(v as string | null)}
        />
        <Select options={options} placeholder="禁用" disabled />
      </div>
    </div>
  );
}
