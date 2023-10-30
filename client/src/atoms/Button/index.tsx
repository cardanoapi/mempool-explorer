import React from 'react';

import { ButtonClasses, ButtonOwnProps, ButtonPropsVariantOverrides, ClassNameMap, Button as MuiButton, SxProps, Theme } from '@mui/material';
import { TouchRippleProps } from '@mui/material/ButtonBase/TouchRipple';
import { OverridableStringUnion } from '@mui/types';

interface IButtonProps extends ButtonOwnProps {
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

export default function Button({
    onClick,
    children,
    size = 'small',
    className = '',
    centerRipple = false,
    classes = {},
    disabled = false,
    disableRipple = false,
    disableTouchRipple = false,
    focusVisibleClassName = '',
    sx = {},
    color = 'primary',
    TouchRippleProps = {},
    variant = 'contained',
    ...props
}: IButtonProps) {
    // TODO: Update styles based on variants and sizes
    const smallSx: SxProps<Theme> = {};
    const mediumSx: SxProps<Theme> = {};
    const largeSx: SxProps<Theme> = {
        height: '48px',
        minWidth: '182px',
        paddingX: '16px',
        paddingY: '12px'
    };

    const textVariant: SxProps<Theme> = size === 'large' ? { ...largeSx, ...sx } : size === 'medium' ? { ...mediumSx, ...sx } : { ...smallSx, ...sx };
    const outlinedVariant: SxProps<Theme> = size === 'large' ? { ...largeSx, ...sx } : size === 'medium' ? { ...mediumSx, ...sx } : { ...smallSx, ...sx };
    const containedVariant: SxProps<Theme> = size === 'large' ? { ...largeSx, ...sx } : size === 'medium' ? { ...mediumSx, ...sx } : { ...smallSx, ...sx };

    const newSx = variant === 'text' ? { ...textVariant } : variant === 'outlined' ? { ...outlinedVariant } : { ...containedVariant };

    return (
        <MuiButton
            className={className}
            onClick={onClick}
            color={color}
            centerRipple={centerRipple}
            classes={classes}
            disabled={disabled}
            disableRipple={disableRipple}
            disableTouchRipple={disableTouchRipple}
            focusVisibleClassName={focusVisibleClassName}
            variant={variant}
            TouchRippleProps={TouchRippleProps}
            sx={newSx}
            {...props}
        >
            {children}
        </MuiButton>
    );
}
