import { FC, SVGAttributes } from 'react';

const BrandIcon: FC<SVGAttributes<{}>> = (props: SVGAttributes<{}>) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="36" height="36" rx="4" fill="url(#paint0_linear_432_286)" />
        <path d="M10.2642 10.4545H14.0568L18.0625 20.2273H18.233L22.2386 10.4545H26.0312V25H23.0483V15.5327H22.9276L19.1634 24.929H17.1321L13.3679 15.4972H13.2472V25H10.2642V10.4545Z" fill="#E6E6E6" />
        <defs>
            <linearGradient id="paint0_linear_432_286" x1="-2.99999" y1="-1.35227e-05" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#CC3CFF" />
                <stop offset="1" stopColor="#60B3FF" />
            </linearGradient>
        </defs>
    </svg>
);

export default BrandIcon;
