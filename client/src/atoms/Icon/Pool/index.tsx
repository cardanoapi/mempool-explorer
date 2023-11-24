import { FC, SVGAttributes } from 'react';

const PoolIcon: FC<SVGAttributes<{}>> = (props: SVGAttributes<{}>) => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect width="36" height="36" rx="4" fill="url(#paint0_linear_196_2791)" />
        <rect x="21.7539" y="12.7049" width="1.15577" height="7.41438" transform="rotate(45.1741 21.7539 12.7049)" stroke="black" strokeWidth="1.15577" />
        <path d="M13.5579 15.1475L10.0699 18.6143C8.79637 20.1129 9.67508 23.4686 10.2736 24.9591C11.8235 25.6302 14.7 26.1466 16.588 25.1721L20.076 21.7053L13.5579 15.1475Z" stroke="black" strokeWidth="2" />
        <path
            d="M21.3405 9.04148C22.0196 8.36651 23.1172 8.36984 23.7922 9.04893L26.2365 11.5081C26.9115 12.1872 26.9081 13.2849 26.2291 13.9599V13.9599C25.55 14.6348 24.4523 14.6315 23.7773 13.9524L21.333 11.4932C20.6581 10.8141 20.6614 9.71646 21.3405 9.04148V9.04148Z"
            stroke="black"
            strokeWidth="2"
        />
        <defs>
            <linearGradient id="paint0_linear_196_2791" x1="0" y1="0" x2="33.5" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF9141" />
                <stop offset="1" stopColor="#FFC296" />
            </linearGradient>
        </defs>
    </svg>
);

export default PoolIcon;