import Button from '.';
import { IButtonProps } from './props';

export default function GradientButton({ children, onClick, ...props }: IButtonProps) {
    return (
        <Button
            className="flex !gap-2 !rounded-[48px] !items-center !font-ibm !text-black !font-normal !text-sm !capitalize bg-gradient-to-br from-[#CC3CFF] to-[#60B3FF] hover:bg-gradient-to-br hover:from-[#CC3CFF] hover:to-[#BD00FF]"
            onClick={onClick}
            disableFocusRipple
            {...props}
        >
            {children}
        </Button>
    );
}
