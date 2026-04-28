import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props as any}
            src="/images/logo.png"
            alt="Where's My Daughter Logo"
            className={`w-auto h-12 ${props.className || ''}`}
        />
    );
}
