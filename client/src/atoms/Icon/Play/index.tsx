import { FC, SVGAttributes } from 'react';

const PlayIcon: FC<SVGAttributes<{}>> = (props: SVGAttributes<{}>) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M5 4V20L19 12L5 4Z" stroke="#0D0D0D" stroke-width="2" stroke-linejoin="round" />
    </svg>
);

export default PlayIcon;
