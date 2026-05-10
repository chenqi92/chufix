import { CfResult, CfButton, CfLink } from '@chufix/react';

export function Error404() {
  return (
    <div className="err">
      <CfResult
        status="404"
        title="页面走丢了"
        description="这个地址可能已经移动、被删除，或者你打错了字符。"
        footer={
          <>
            <div className="err__actions">
              <CfButton variant="primary">返回首页</CfButton>
              <CfButton variant="tertiary">联系支持</CfButton>
            </div>
            <p className="err__links">
              常见入口：<CfLink href="#">所有组件</CfLink> · <CfLink href="#">Blocks</CfLink> · <CfLink href="#">主题与 token</CfLink>
            </p>
          </>
        }
      />
    </div>
  );
}
