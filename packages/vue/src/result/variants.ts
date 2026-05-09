export type ResultStatus =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | '404'
  | '403'
  | '500';

export type ResultSize = 'sm' | 'md' | 'lg';

export interface ResultProps {
  status?: ResultStatus;
  title?: string;
  description?: string;
  size?: ResultSize;
  className?: string;
}

export function resultClass(p: {
  status: ResultStatus;
  size: ResultSize;
  className?: string;
}): string {
  return [
    'cf-result',
    `cf-result--${p.status}`,
    `cf-result--${p.size}`,
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function resultDefaultTitle(status: ResultStatus): string {
  switch (status) {
    case 'success': return '操作成功';
    case 'info': return '提示';
    case 'warning': return '请注意';
    case 'error': return '操作失败';
    case '404': return '404 页面不存在';
    case '403': return '403 无权访问';
    case '500': return '500 服务器开小差了';
  }
}
