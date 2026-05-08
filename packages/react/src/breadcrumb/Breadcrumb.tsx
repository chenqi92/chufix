import { type BreadcrumbProps } from './variants';

export function Breadcrumb({ items = [], separator = '/' }: BreadcrumbProps) {
  return (
    <nav className="cf-breadcrumb" aria-label="breadcrumb">
      <ol className="cf-breadcrumb__list">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li
              key={i}
              className={['cf-breadcrumb__item', last ? 'is-current' : ''].filter(Boolean).join(' ')}
            >
              {item.href && !last ? (
                <a href={item.href} className="cf-breadcrumb__link">{item.label}</a>
              ) : (
                <span className="cf-breadcrumb__current" aria-current="page">{item.label}</span>
              )}
              {!last && (
                <span className="cf-breadcrumb__sep" aria-hidden="true">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
