import { CfResult, CfButton, CfBanner } from '@chufix/react';

export function Error403() {
  return (
    <div className="err">
      <CfResult
        status="403"
        title="无访问权限"
        description="当前账号 · jane.l · 没有访问此资源的权限。"
        footer={
          <>
            <div className="err__banner">
              <CfBanner
                tone="warning"
                title="需要 admin 角色"
                description="联系工作区所有者授予 'team-orders' 的 read 权限即可访问。"
              />
            </div>
            <div className="err__actions">
              <CfButton variant="primary">申请权限</CfButton>
              <CfButton variant="tertiary">切换账号</CfButton>
            </div>
          </>
        }
      />
    </div>
  );
}
