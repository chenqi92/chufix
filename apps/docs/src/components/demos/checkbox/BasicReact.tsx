import { useState } from 'react';
import { Checkbox } from '@chukit/react';

export default function BasicReact() {
  const [apple, setApple] = useState(true);
  const [banana, setBanana] = useState(false);
  const [cherry, setCherry] = useState(false);

  const checkedCount = [apple, banana, cherry].filter(Boolean).length;
  const allChecked = checkedCount === 3;
  const indeterminate = checkedCount > 0 && checkedCount < 3;

  return (
    <div className="demo-stack">
      <Checkbox
        checked={allChecked}
        indeterminate={indeterminate}
        onChange={(e) => {
          const v = e.target.checked;
          setApple(v);
          setBanana(v);
          setCherry(v);
        }}
      >
        全选
      </Checkbox>
      <div className="demo-row">
        <Checkbox checked={apple} onChange={(e) => setApple(e.target.checked)}>
          苹果
        </Checkbox>
        <Checkbox checked={banana} onChange={(e) => setBanana(e.target.checked)}>
          香蕉
        </Checkbox>
        <Checkbox checked={cherry} onChange={(e) => setCherry(e.target.checked)}>
          樱桃
        </Checkbox>
      </div>
      <div className="demo-row">
        <Checkbox size="sm" defaultChecked>
          sm 已选
        </Checkbox>
        <Checkbox size="lg">lg</Checkbox>
        <Checkbox disabled>禁用</Checkbox>
        <Checkbox disabled defaultChecked>
          禁用已选
        </Checkbox>
      </div>
    </div>
  );
}
