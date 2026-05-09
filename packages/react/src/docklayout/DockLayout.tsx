import { Fragment, useState, type ReactNode } from 'react';
import type {
  DockGroup,
  DockLayoutProps,
  DockPanel,
} from './variants';

interface NodeProps {
  group: DockGroup;
  active: Record<string, string>;
  setActive: (groupId: string, panelId: string) => void;
  slots: Record<string, ReactNode>;
  onPanelClose?: (groupId: string, panelId: string, panel: DockPanel) => void;
  onPanelDetach?: (groupId: string, panelId: string, panel: DockPanel) => void;
}

function panelStyle(p: DockGroup | DockPanel) {
  if (p.size == null) return undefined;
  return {
    flex:
      typeof p.size === 'number' ? `${p.size} ${p.size} 0` : `0 0 ${p.size}`,
  };
}

function activeFor(
  group: DockGroup,
  active: Record<string, string>,
): string | null {
  if (!group.panels?.length) return null;
  return active[group.id] || group.panels[0].id;
}

function DockNode(props: NodeProps) {
  const { group, active, setActive, slots, onPanelClose, onPanelDetach } = props;

  if (group.children && group.children.length > 0) {
    return (
      <div
        className={`cf-dock__split cf-dock__split--${group.orientation}`}
        style={panelStyle(group)}
      >
        {group.children.map((child) => (
          <DockNode
            key={child.id}
            group={child}
            active={active}
            setActive={setActive}
            slots={slots}
            onPanelClose={onPanelClose}
            onPanelDetach={onPanelDetach}
          />
        ))}
      </div>
    );
  }

  const panels = group.panels ?? [];
  const activeId = activeFor(group, active);

  return (
    <div className="cf-dock__pane" style={panelStyle(group)}>
      <div className="cf-dock__tabs" role="tablist">
        {panels.map((pn) => (
          <div
            key={pn.id}
            className={[
              'cf-dock__tab',
              pn.id === activeId && 'is-active',
            ]
              .filter(Boolean)
              .join(' ')}
            role="tab"
            aria-selected={pn.id === activeId}
            onClick={() => setActive(group.id, pn.id)}
          >
            <span className="cf-dock__tab-label">{pn.title}</span>
            {pn.detachable ? (
              <button
                type="button"
                className="cf-dock__tab-btn"
                title="分离"
                onClick={(e) => {
                  e.stopPropagation();
                  onPanelDetach?.(group.id, pn.id, pn);
                }}
              >
                ⇱
              </button>
            ) : null}
            {pn.closable ? (
              <button
                type="button"
                className="cf-dock__tab-btn"
                title="关闭"
                onClick={(e) => {
                  e.stopPropagation();
                  onPanelClose?.(group.id, pn.id, pn);
                }}
              >
                ×
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <div className="cf-dock__body">
        {panels.map((pn) => {
          const key = `panel-${pn.contentKey ?? pn.id}`;
          if (pn.id !== activeId) return null;
          return (
            <Fragment key={pn.id}>
              <div className="cf-dock__panel-content">{slots[key] ?? null}</div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function DockLayout(props: DockLayoutProps) {
  const {
    layout,
    active: activeProp,
    onActiveChange,
    onPanelClose,
    onPanelDetach,
    slots = {},
    className,
  } = props;

  const [localActive, setLocalActive] = useState<Record<string, string>>(
    activeProp ?? {},
  );

  const merged: Record<string, string> = {
    ...localActive,
    ...(activeProp ?? {}),
  };

  const setActive = (groupId: string, panelId: string) => {
    setLocalActive((cur) => ({ ...cur, [groupId]: panelId }));
    onActiveChange?.(groupId, panelId);
  };

  return (
    <div className={['cf-dock', className].filter(Boolean).join(' ')}>
      <DockNode
        group={layout}
        active={merged}
        setActive={setActive}
        slots={slots}
        onPanelClose={onPanelClose}
        onPanelDetach={onPanelDetach}
      />
    </div>
  );
}
