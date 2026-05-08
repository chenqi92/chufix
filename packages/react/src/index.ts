import '@chufix/tokens/tokens.css';
import './styles/button.css';
import './styles/input.css';
import './styles/card.css';
import './styles/switch.css';
import './styles/checkbox.css';
import './styles/radio.css';
import './styles/textarea.css';
import './styles/select.css';
import './styles/tooltip.css';
import './styles/toast.css';
import './styles/tag.css';
import './styles/badge.css';
import './styles/avatar.css';
import './styles/modal.css';
import './styles/tabs.css';
import './styles/alert.css';
import './styles/skeleton.css';

/* All component exports use the Cf prefix (matching the CSS `cf-` class
 * prefix; `cf` from chufix) so consumers can keep the imported name in
 * their JSX and disambiguate against other UI libraries. Want short
 * names? Alias on import: `import { CfButton as Button } from '@chufix/react'`. */

export { Button as CfButton } from './button/Button';
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
} from './button/variants';

export { Input as CfInput } from './input/Input';
export type { InputProps, InputVariant, InputSize } from './input/variants';

export {
  Card as CfCard,
  CardHeader as CfCardHeader,
  CardBody as CfCardBody,
  CardFooter as CfCardFooter,
} from './card/Card';
export type { CardProps, CardVariant } from './card/variants';

export { Switch as CfSwitch } from './switch/Switch';
export type { SwitchProps, SwitchSize } from './switch/variants';

export { Checkbox as CfCheckbox } from './checkbox/Checkbox';
export type { CheckboxProps, CheckboxSize } from './checkbox/variants';

export { Radio as CfRadio } from './radio/Radio';
export {
  RadioGroup as CfRadioGroup,
  RadioGroupContext,
} from './radio/RadioGroup';
export type {
  RadioProps,
  RadioGroupProps,
  RadioSize,
  RadioValue,
} from './radio/variants';

export { Textarea as CfTextarea } from './textarea/Textarea';
export type {
  TextareaProps,
  TextareaVariant,
  TextareaSize,
  TextareaResize,
} from './textarea/variants';

export { Select as CfSelect } from './select/Select';
export type {
  SelectProps,
  SelectOption,
  SelectVariant,
  SelectSize,
  SelectValue,
} from './select/variants';

export { Tooltip as CfTooltip } from './tooltip/Tooltip';
export type { TooltipProps, TooltipPlacement } from './tooltip/variants';

export { Toaster as CfToaster } from './toast/Toaster';
export type { ToasterProps } from './toast/Toaster';
export { toast, toastStore } from './toast/store';
export type { ToastItem, ToastInput, ToastType } from './toast/store';

export { Tag as CfTag } from './tag/Tag';
export type { TagProps, TagVariant, TagSize, TagTone } from './tag/variants';

export { Badge as CfBadge } from './badge/Badge';
export type {
  BadgeProps,
  BadgeTone,
  BadgePlacement,
} from './badge/variants';

export { Avatar as CfAvatar } from './avatar/Avatar';
export { AvatarGroup as CfAvatarGroup } from './avatar/AvatarGroup';
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarSize,
  AvatarShape,
} from './avatar/variants';

export { Modal as CfModal } from './modal/Modal';
export type { ModalProps, ModalSize } from './modal/variants';

export { Tabs as CfTabs, TabPanel as CfTabPanel } from './tabs/Tabs';
export type {
  TabsProps,
  TabsItem,
  TabsVariant,
  TabsSize,
  TabsAlign,
} from './tabs/variants';

export { Alert as CfAlert } from './alert/Alert';
export type { AlertProps, AlertTone, AlertVariant } from './alert/variants';

export { Skeleton as CfSkeleton } from './skeleton/Skeleton';
export type { SkeletonProps, SkeletonShape } from './skeleton/variants';
