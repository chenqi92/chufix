import { useState } from 'react';
import { Radio, RadioGroup } from '@chukit/react';

export default function BasicReact() {
  const [plan, setPlan] = useState<'free' | 'pro' | 'team'>('pro');
  const [dir, setDir] = useState<'row' | 'column'>('row');

  return (
    <div className="demo-stack">
      <RadioGroup
        value={plan}
        name="plan"
        onChange={(v) => setPlan(v as 'free' | 'pro' | 'team')}
      >
        <Radio value="free">Free</Radio>
        <Radio value="pro">Pro</Radio>
        <Radio value="team">Team</Radio>
      </RadioGroup>
      <p className="demo-hint">
        已选：<code>{plan}</code>
      </p>

      <RadioGroup
        value={dir}
        direction="column"
        onChange={(v) => setDir(v as 'row' | 'column')}
      >
        <Radio value="row">竖直方向 column</Radio>
        <Radio value="column" disabled>
          禁用项
        </Radio>
      </RadioGroup>
    </div>
  );
}
