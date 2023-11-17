import { FC, SVGAttributes } from 'react';

const TriangleIndicator: FC<SVGAttributes<{}>> = (props: SVGAttributes<{}>) => (
    <svg width="40" height="23" viewBox="0 0 40 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M20 23L0 0H40L20 23Z" fill="#E6E6E6" />
    </svg>
);

export default TriangleIndicator;