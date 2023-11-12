import { FC, SVGAttributes } from 'react';

const TxIcon: FC<SVGAttributes<{}>> = (props: SVGAttributes<{}>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M7.57 8.38V19H5.23V8.38H1.45V6.436H11.35V8.38H7.57ZM12.405 19L15.879 14.284L12.603 9.712H15.249L16.365 11.35L17.229 12.646H17.355L18.219 11.35L19.335 9.712H21.783L18.507 14.176L21.981 19H19.317L18.039 17.128L17.157 15.814H17.031L16.149 17.128L14.871 19H12.405Z"
            fill="#0D0D0D"
        />
    </svg>
);

export default TxIcon;
