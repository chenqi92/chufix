import { useState } from 'react';
import { CfResult, CfButton, CfDescriptionList } from '@chufix/react';

const debug = [
  { label: 'URL', value: 'https://api.protoforge.io/v1/orders' },
  { label: 'Method', value: 'GET' },
  { label: 'Status', value: '0 (network unreachable)' },
  { label: 'Trace', value: 'a8b2-3914-c012' },
];

export function ErrorNetwork() {
  const [retrying, setRetrying] = useState(false);

  async function retry() {
    setRetrying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRetrying(false);
  }

  return (
    <div className="err">
      <CfResult
        status="500"
        title="网络异常"
        description="无法连接到服务，请检查你的网络或稍后重试。"
        footer={
          <>
            <div className="err__actions">
              <CfButton variant="primary" loading={retrying} onClick={retry}>
                {retrying ? '重试中…' : '重试'}
              </CfButton>
              <CfButton variant="tertiary">检测网络</CfButton>
            </div>
            <details className="err__debug">
              <summary>诊断信息</summary>
              <CfDescriptionList items={debug} />
            </details>
          </>
        }
      />
    </div>
  );
}
