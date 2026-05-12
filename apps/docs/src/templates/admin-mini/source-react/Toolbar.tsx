import { useContext } from 'react';
import { CfButton, CfSegmentedControl } from '@chufix-design/react';
import {
  DemoContext,
  STRINGS,
  type DemoTheme,
  type DemoDensity,
  type DemoMenuForm,
  type DemoAccent,
  type DemoLocale,
} from './state';

interface Props { sourceOpen: boolean; onToggleSource: () => void }

export default function Toolbar({ sourceOpen, onToggleSource }: Props) {
  const ctx = useContext(DemoContext)!;
  const t = STRINGS[ctx.locale];

  const themeOpts: { value: DemoTheme; label: string }[] = [
    { value: 'dark-cool', label: t.switch_theme === 'Theme' ? 'Dark cool' : '深蓝' },
    { value: 'dark-warm', label: t.switch_theme === 'Theme' ? 'Dark warm' : '深棕' },
    { value: 'light',     label: t.switch_theme === 'Theme' ? 'Light' : '浅色' },
  ];
  const densityOpts: { value: DemoDensity; label: string }[] = [
    { value: 'comfortable', label: t.switch_density === 'Density' ? 'Comfortable' : '宽松' },
    { value: 'compact',     label: t.switch_density === 'Density' ? 'Compact' : '紧凑' },
  ];
  const menuOpts: { value: DemoMenuForm; label: string }[] = [
    { value: 'sidebar',   label: t.switch_menu === 'Menu' ? 'Sidebar' : '侧栏' },
    { value: 'topbar',    label: t.switch_menu === 'Menu' ? 'Topbar' : '顶栏' },
    { value: 'collapsed', label: t.switch_menu === 'Menu' ? 'Collapsed' : '折叠侧栏' },
  ];
  const accentOpts: { value: DemoAccent; color: string }[] = [
    { value: 'blue',   color: 'oklch(64% 0.16 263)' },
    { value: 'green',  color: 'oklch(68% 0.16 150)' },
    { value: 'purple', color: 'oklch(64% 0.18 300)' },
    { value: 'orange', color: 'oklch(72% 0.16 60)' },
    { value: 'rose',   color: 'oklch(66% 0.18 15)' },
  ];
  const localeOpts: { value: DemoLocale; label: string }[] = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'EN' },
  ];

  return (
    <div className="adm-toolbar">
      <div className="adm-toolbar__group">
        <span className="adm-toolbar__label">{t.switch_theme}</span>
        <CfSegmentedControl
          modelValue={ctx.theme}
          items={themeOpts.map((o) => ({ value: o.value, label: o.label }))}
          size="sm"
          onUpdateModelValue={(v) => ctx.setTheme(v as DemoTheme)}
        />
      </div>
      <div className="adm-toolbar__group">
        <span className="adm-toolbar__label">{t.switch_density}</span>
        <CfSegmentedControl
          modelValue={ctx.density}
          items={densityOpts.map((o) => ({ value: o.value, label: o.label }))}
          size="sm"
          onUpdateModelValue={(v) => ctx.setDensity(v as DemoDensity)}
        />
      </div>
      <div className="adm-toolbar__group">
        <span className="adm-toolbar__label">{t.switch_menu}</span>
        <CfSegmentedControl
          modelValue={ctx.menuForm}
          items={menuOpts.map((o) => ({ value: o.value, label: o.label }))}
          size="sm"
          onUpdateModelValue={(v) => ctx.setMenuForm(v as DemoMenuForm)}
        />
      </div>
      <div className="adm-toolbar__group">
        <span className="adm-toolbar__label">{t.switch_accent}</span>
        <div className="adm-toolbar__accents">
          {accentOpts.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`adm-toolbar__dot${ctx.accent === o.value ? ' is-active' : ''}`}
              style={{ background: o.color }}
              aria-label={o.value}
              aria-pressed={ctx.accent === o.value}
              onClick={() => ctx.setAccent(o.value)}
            />
          ))}
        </div>
      </div>
      <div className="adm-toolbar__group">
        <span className="adm-toolbar__label">{t.switch_locale}</span>
        <CfSegmentedControl
          modelValue={ctx.locale}
          items={localeOpts.map((o) => ({ value: o.value, label: o.label }))}
          size="sm"
          onUpdateModelValue={(v) => ctx.setLocale(v as DemoLocale)}
        />
      </div>
      <div className="adm-toolbar__spacer" />
      <CfButton size="sm" variant={sourceOpen ? 'secondary' : 'tertiary'} onClick={onToggleSource}>
        {sourceOpen ? t.hide_source : t.view_source}
      </CfButton>
    </div>
  );
}
