import { useState } from 'react';
import { type ReasoningNode, scoreColor } from './variants';

export interface ReasoningTreeProps {
  root: ReasoningNode;
  showScores?: boolean;
  initialCollapsedDepth?: number;
  className?: string;
}

interface NodeItemProps {
  node: ReasoningNode;
  depth: number;
  showScores: boolean;
  initialCollapsedDepth?: number;
}

function NodeItem({ node, depth, showScores, initialCollapsedDepth }: NodeItemProps) {
  const initial = initialCollapsedDepth !== undefined && depth >= initialCollapsedDepth;
  const [collapsed, setCollapsed] = useState(initial);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <li
      className={[
        'cf-rtree__node',
        node.selected && 'is-selected',
        hasChildren && 'has-children',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="cf-rtree__row">
        {hasChildren ? (
          <button
            type="button"
            className={['cf-rtree__toggle', collapsed && 'is-collapsed'].filter(Boolean).join(' ')}
            onClick={() => setCollapsed((c) => !c)}
            aria-label="toggle children"
          >
            ›
          </button>
        ) : (
          <span className="cf-rtree__leaf">•</span>
        )}
        <span className="cf-rtree__thought">{node.thought}</span>
        {showScores && node.score !== undefined && (
          <span className="cf-rtree__score" style={{ color: scoreColor(node.score) }}>
            {(node.score * 100).toFixed(0)}%
          </span>
        )}
      </div>
      {hasChildren && !collapsed && (
        <ul className="cf-rtree__children">
          {node.children!.map((c) => (
            <NodeItem
              key={c.id}
              node={c}
              depth={depth + 1}
              showScores={showScores}
              initialCollapsedDepth={initialCollapsedDepth}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function ReasoningTree({
  root,
  showScores = true,
  initialCollapsedDepth,
  className,
}: ReasoningTreeProps) {
  return (
    <div className={['cf-rtree', className].filter(Boolean).join(' ')}>
      <ul className="cf-rtree__root">
        <NodeItem
          node={root}
          depth={0}
          showScores={showScores}
          initialCollapsedDepth={initialCollapsedDepth}
        />
      </ul>
    </div>
  );
}
