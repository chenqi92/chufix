import { pageHeaderClass, type PageHeaderProps } from './variants';

export function PageHeader(props: PageHeaderProps) {
  const {
    title,
    description,
    breadcrumb,
    back,
    actions,
    toolbar,
    tabs,
    size = 'md',
    bordered = true,
    className,
  } = props;

  return (
    <header className={pageHeaderClass({ size, bordered, className })}>
      {breadcrumb ? (
        <div className="cf-page-header__breadcrumb">{breadcrumb}</div>
      ) : null}
      <div className="cf-page-header__bar">
        <div className="cf-page-header__lead">
          {back}
          <div className="cf-page-header__heading">
            {title ? <h1 className="cf-page-header__title">{title}</h1> : null}
            {description ? (
              <p className="cf-page-header__description">{description}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="cf-page-header__actions">{actions}</div> : null}
      </div>
      {toolbar ? <div className="cf-page-header__toolbar">{toolbar}</div> : null}
      {tabs ? <div className="cf-page-header__tabs">{tabs}</div> : null}
    </header>
  );
}
