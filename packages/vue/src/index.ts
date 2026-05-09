import '@chufix/tokens/tokens.css';
import './styles/icon.css';
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
import './styles/divider.css';
import './styles/empty.css';
import './styles/progress.css';
import './styles/breadcrumb.css';
import './styles/pagination.css';
import './styles/spinner.css';
import './styles/searchinput.css';
import './styles/numberinput.css';
import './styles/accordion.css';
import './styles/slider.css';
import './styles/drawer.css';
import './styles/popover.css';
import './styles/dropdown.css';
import './styles/inputgroup.css';
import './styles/otp.css';
import './styles/form.css';
import './styles/combobox.css';
import './styles/taginput.css';
import './styles/dropzone.css';
import './styles/colorpicker.css';

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

export { default as CfDivider } from './divider/Divider.vue';
export type {
  DividerProps,
  DividerOrientation,
  DividerVariant,
} from './divider/variants';

export { default as CfEmpty } from './empty/Empty.vue';
export type { EmptyProps, EmptySize } from './empty/variants';

export { default as CfProgress } from './progress/Progress.vue';
export type {
  ProgressProps,
  ProgressVariant,
  ProgressTone,
  ProgressSize,
} from './progress/variants';

export { default as CfBreadcrumb } from './breadcrumb/Breadcrumb.vue';
export type { BreadcrumbProps, BreadcrumbItem } from './breadcrumb/variants';

export { default as CfPagination } from './pagination/Pagination.vue';
export type { PaginationProps, PaginationSize } from './pagination/variants';

export { default as CfSpinner } from './spinner/Spinner.vue';
export type { SpinnerProps, SpinnerSize, SpinnerTone } from './spinner/variants';

export { default as CfSearchInput } from './searchinput/SearchInput.vue';
export type { SearchInputProps, SearchInputSize } from './searchinput/variants';

export { default as CfNumberInput } from './numberinput/NumberInput.vue';
export type { NumberInputProps, NumberInputSize } from './numberinput/variants';

export { default as CfAccordion } from './accordion/Accordion.vue';
export type {
  AccordionProps,
  AccordionItem,
  AccordionMode,
  AccordionVariant,
} from './accordion/variants';

export { default as CfSlider } from './slider/Slider.vue';
export type {
  SliderProps,
  SliderSize,
  SliderTone,
} from './slider/variants';

export { default as CfDrawer } from './drawer/Drawer.vue';
export type {
  DrawerProps,
  DrawerPlacement,
  DrawerSize,
} from './drawer/variants';

export { default as CfPopover } from './popover/Popover.vue';
export type {
  PopoverProps,
  PopoverPlacement,
  PopoverTrigger,
} from './popover/variants';

export { default as CfDropdown } from './dropdown/Dropdown.vue';
export type {
  DropdownProps,
  DropdownPlacement,
  DropdownItem,
} from './dropdown/variants';

export { default as CfInputGroup } from './inputgroup/InputGroup.vue';
export type {
  InputGroupProps,
  InputGroupOrientation,
  InputGroupSize,
} from './inputgroup/variants';

export { default as CfOtpInput } from './otp/OtpInput.vue';
export type { OtpInputProps, OtpInputSize, OtpInputType } from './otp/variants';

export { default as CfForm } from './form/Form.vue';
export { default as CfFormField } from './form/FormField.vue';
export type {
  FormProps,
  FormFieldProps,
  FormLayout,
  FormSize,
} from './form/variants';

export { default as CfCombobox } from './combobox/Combobox.vue';
export type {
  ComboboxProps,
  ComboboxOption,
  ComboboxVariant,
  ComboboxSize,
  ComboboxValue,
} from './combobox/variants';

export { default as CfTagInput } from './taginput/TagInput.vue';
export type {
  TagInputProps,
  TagInputVariant,
  TagInputSize,
  TagInputTone,
} from './taginput/variants';

export { default as CfDropzone } from './dropzone/Dropzone.vue';
export type {
  DropzoneProps,
  DropzoneSize,
  DropzoneRejectReason,
  DropzoneRejection,
  DropzoneFileStatus,
} from './dropzone/variants';

export { default as CfColorPicker } from './colorpicker/ColorPicker.vue';
export type {
  ColorPickerProps,
  ColorPickerSize,
} from './colorpicker/variants';
export type { ColorFormat, RGB, RGBA, HSV, HSL } from './colorpicker/color';

export { default as CfIcon } from './icon/Icon.vue';
export type {
  IconProps,
  IconSize,
  IconStrokeWidth,
} from './icon/variants';
export type { IconName } from '@chufix/icons';
