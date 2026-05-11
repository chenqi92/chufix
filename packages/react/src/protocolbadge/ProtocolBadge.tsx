import {
  displayLabel,
  protocolBadgeClass,
  type ProtocolBadgeProps,
} from './variants';

export function ProtocolBadge(props: ProtocolBadgeProps) {
  const cls = protocolBadgeClass(props);
  const label = displayLabel(props.kind);
  return (
    <span className={cls} role="img" aria-label={label}>
      {label}
    </span>
  );
}

/** Alias of ProtocolBadge for HTTP-method-only contexts. */
export const MethodBadge = ProtocolBadge;
