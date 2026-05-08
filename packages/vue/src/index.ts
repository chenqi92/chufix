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
 * their template and disambiguate against other UI libraries. Want short
 * names? Alias on import: `import { CfButton as Button } from '@chufix/vue'`. */

export { default as CfButton } from './button/Button.vue';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonShape } from './button/variants';

export { default as CfInput } from './input/Input.vue';
export type { InputProps, InputVariant, InputSize } from './input/variants';

export { default as CfCard } from './card/Card.vue';
export type { CardProps, CardVariant } from './card/variants';

export { default as CfSwitch } from './switch/Switch.vue';
export type { SwitchProps, SwitchSize } from './switch/variants';

export { default as CfCheckbox } from './checkbox/Checkbox.vue';
export type { CheckboxProps, CheckboxSize } from './checkbox/variants';

export { default as CfRadio } from './radio/Radio.vue';
export { default as CfRadioGroup } from './radio/RadioGroup.vue';
export type {
  RadioProps,
  RadioGroupProps,
  RadioSize,
  RadioValue,
} from './radio/variants';

export { default as CfTextarea } from './textarea/Textarea.vue';
export type {
  TextareaProps,
  TextareaVariant,
  TextareaSize,
  TextareaResize,
} from './textarea/variants';

export { default as CfSelect } from './select/Select.vue';
export type {
  SelectProps,
  SelectOption,
  SelectVariant,
  SelectSize,
  SelectValue,
} from './select/variants';

export { default as CfTooltip } from './tooltip/Tooltip.vue';
export type { TooltipProps, TooltipPlacement } from './tooltip/variants';

export { default as CfToaster } from './toast/Toaster.vue';
export { toast, toastStore } from './toast/store';
export type { ToastItem, ToastInput, ToastType } from './toast/store';

export { default as CfTag } from './tag/Tag.vue';
export type { TagProps, TagVariant, TagSize, TagTone } from './tag/variants';

export { default as CfBadge } from './badge/Badge.vue';
export type {
  BadgeProps,
  BadgeTone,
  BadgePlacement,
} from './badge/variants';

export { default as CfAvatar } from './avatar/Avatar.vue';
export { default as CfAvatarGroup } from './avatar/AvatarGroup.vue';
export type {
  AvatarProps,
  AvatarGroupProps,
  AvatarSize,
  AvatarShape,
} from './avatar/variants';

export { default as CfModal } from './modal/Modal.vue';
export type { ModalProps, ModalSize } from './modal/variants';

export { default as CfTabs } from './tabs/Tabs.vue';
export { default as CfTabPanel } from './tabs/TabPanel.vue';
export type {
  TabsProps,
  TabsItem,
  TabsVariant,
  TabsSize,
  TabsAlign,
} from './tabs/variants';

export { default as CfAlert } from './alert/Alert.vue';
export type { AlertProps, AlertTone, AlertVariant } from './alert/variants';

export { default as CfSkeleton } from './skeleton/Skeleton.vue';
export type { SkeletonProps, SkeletonShape } from './skeleton/variants';
