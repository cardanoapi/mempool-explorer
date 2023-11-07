import { FC, SVGAttributes } from 'react';

const WalletIcon: FC<SVGAttributes<{}>> = (props: SVGAttributes<{}>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M21 9H13.8947C12.3251 9 11.0526 10.3431 11.0526 12C11.0526 13.6569 12.3251 15 13.8947 15H21M13.8947 12V12.01M5 5H19C20.1046 5 21 6.04467 21 7.33333V16.6667C21 17.9553 20.1046 19 19 19H5C3.89543 19 3 17.9553 3 16.6667V7.33333C3 6.04467 3.89543 5 5 5Z"
            stroke="#0D0D0D"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default WalletIcon;
