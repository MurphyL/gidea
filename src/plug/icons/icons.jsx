import SimpleIcons from "simple-icons";

import BootStrapIcons from 'bootstrap-icons/bootstrap-icons.svg';

const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const SimpleIcon = ({ slug = 'simpleicons', size, width = 24, height = 24, fill }) => {
    const { title, path, hex } = SimpleIcons.get(slug);
    const color = fill || hex2rgba(hex);
    return (
        <svg role="img" width={size || width} height={size || height} fill={color}>
            <title>{title}</title>
            <path d={path} />
        </svg>
    );
};

export const BootStrapIcon = ({ slug = 'tools', size, width = 24, height = 24, fill }) => {
    return (
        <svg role="img" width={size || width} height={size || height} fill={fill || 'currentColor'}>
            <use xlinkHref={BootStrapIcons + '#' + slug} />
        </svg>
    )
};