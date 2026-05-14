export interface FormSectionProps {
  /** Section title. */
  title?: string;
  /** Description rendered below the title. */
  description?: string;
  /** Anchor id used for skip-link / scroll. */
  anchor?: string;
  /** Allow collapse / expand. */
  collapsible?: boolean;
  /** Initial collapsed state. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
}
