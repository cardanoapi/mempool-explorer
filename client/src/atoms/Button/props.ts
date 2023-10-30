import { ButtonClasses, ButtonOwnProps, ButtonPropsVariantOverrides, ClassNameMap, SxProps, Theme } from '@mui/material';
import { TouchRippleProps } from '@mui/material/ButtonBase/TouchRipple';
import { OverridableStringUnion } from '@mui/types';

export interface IButtonProps extends ButtonOwnProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    className?: string;
    color?: 'error' | 'inherit' | 'primary' | 'success' | 'info' | 'warning' | 'secondary';
    centerRipple?: boolean;
    classes?: Partial<ButtonClasses> & Partial<ClassNameMap<never>>;
    disabled?: boolean;
    disableRipple?: boolean;
    disableTouchRipple?: boolean;
    focusRipple?: boolean;
    focusVisibleClassName?: string;
    sx?: SxProps<Theme>;
    TouchRippleProps?: Partial<TouchRippleProps>;
    variant?: OverridableStringUnion<'text' | 'outlined' | 'contained', ButtonPropsVariantOverrides>;
}
