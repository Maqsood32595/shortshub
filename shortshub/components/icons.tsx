import React from 'react';

interface IconProps {
    className?: string;
}

export const YouTubeIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        className={className} 
        viewBox="0 0 28 20" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path d="M27.389 3.018a3.483 3.483 0 0 0-2.454-2.47C22.76.002 14.002.002 14.002.002s-8.758 0-10.935.546A3.483 3.483 0 0 0 .613 3.018C.065 5.17 0 9.333 0 9.333s.065 4.163.613 6.315a3.483 3.483 0 0 0 2.454 2.47c2.177.546 10.935.546 10.935.546s8.758 0 10.935-.546a3.483 3.483 0 0 0 2.454-2.47c.548-2.152.613-6.315.613-6.315s-.065-4.163-.613-6.315ZM11.202 13.333V5.333l7.002 4-7.002 4Z"/>
    </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
    </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
        aria-hidden="true"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export const MagicWandIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
        aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .879 16.5a3 3 0 0 1 4.242-4.242 3 3 0 0 0 4.242-4.242 3 3 0 0 1 4.242-4.242 3 3 0 0 1 4.242 4.242 3 3 0 0 0 4.242 4.242 3 3 0 0 1-4.242 4.242 3 3 0 0 1-4.242-4.242 3 3 0 0 0-5.78-1.128Zm0 0L8 14.25m-3.879-3.879L3 8.25m13.5 0-3 3m3 0-3-3m-3.879 11.121L12 17.25m3.879 3.879L17.25 21m-3.879-3.879L12 14.25" />
    </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        className={className}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const AdjustmentsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const FilmIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75h15a1.5 1.5 0 0 0 1.5-1.5v-10.5a1.5 1.5 0 0 0-1.5-1.5h-15a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5Zm-3.75-1.5v-10.5a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75Zm-1.5-1.5v-7.5m19.5 7.5v-7.5" />
    </svg>
);

export const UserCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const RetryIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.664 0l3.181-3.183m-11.664 0-3.181 3.183m0 0-3.181-3.183m0 0h16.5m-13.5-9.348v4.992m0 0h4.992m-4.993 0-3.181-3.183a8.25 8.25 0 0 1 11.664 0l3.181 3.183m-11.664 0 3.181-3.183m0 0 3.181 3.183" />
    </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 0 1-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.542-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.003-.827c.293-.24.438-.613.438-.995s-.145-.755-.438-.995l-1.003-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.075-.124.073-.044.146-.087.22-.127.332-.183.582-.495.645-.87l.213-1.281Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const TikTokIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.13.04-4.27-.63-5.88-2.12-1.64-1.52-2.42-3.84-2.2-6.14.22-2.29 1.57-4.29 3.52-5.46.61-.37 1.28-.61 1.99-.73.03 1.54-.01 3.09-.01 4.63-.33.15-.66.29-1 .46.33 2.1 1.83 3.47 3.86 3.6.87.06 1.73-.13 2.5-.54.91-.48 1.58-1.32 1.86-2.33.25-.92.23-1.91.07-2.86-.02-1.15.02-2.31.02-3.46-.92.17-1.83.34-2.75.51.02-1.68.02-3.37.01-5.05.78-.18 1.56-.34 2.35-.51z"/>
    </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.305-1.48.77-2.175 1.465C1.27 2.805.81 3.505.504 4.29c-.3 1.05-.5 1.9-.533 3.255C-.045 8.88.002 9.29.002 12.5s-.047 3.62.002 4.935c.033 1.355.234 2.2.533 3.255.304.78.765 1.475 1.465 2.175.7.7 1.39.155 2.175.465 1.05.3 1.9.5 3.255.533 1.32.057 1.725.072 4.98.072s3.66-.015 4.935-.072c1.355-.033 2.2-.234 3.255-.533.78-.305 1.475-.765 2.175-1.465.7-.7 1.155-1.39 1.465-2.175.3-1.05.5-1.9.533-3.255.057-1.32.072-1.725.072-4.98s-.015-3.66-.072-4.935c-.033-1.355-.234-2.2-.533-3.255-.305-.78-.765-1.475-1.465-2.175C21.195 1.27 20.495.81 19.71.504c-1.05-.3-1.9-.5-3.255-.533C15.12-.045 14.71.002 12 .002zm0 2.16c3.203 0 3.585.016 4.85.07 1.17.05 1.805.245 2.227.415.56.22 1.005.45 1.485.93.48.48.71.925.93 1.485.17.422.365 1.057.413 2.227.054 1.265.07 1.646.07 4.85s-.016 3.585-.07 4.85c-.05 1.17-.245 1.805-.413 2.227-.22.56-.45 1.005-.93 1.485-.48.48-.925.71-1.485.93-.422.17-1.057.365-2.227.413-1.265.054-1.646.07-4.85.07s-3.585-.016-4.85-.07c-1.17-.05-1.805-.245-2.227-.413-.56-.22-1.005-.45-1.485-.93-.48-.48-.71-.925-.93-1.485-.17-.422-.365-1.057-.413-2.227-.054-1.265-.07-1.646-.07-4.85s.016-3.585.07-4.85c.05-1.17.245-1.805.413-2.227.22-.56.45-1.005.93-1.485.48-.48.925-.71 1.485-.93.422-.17 1.057-.365 2.227-.413C8.415 2.176 8.797 2.16 12 2.16zm0 9.09c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6.66c-1.47 0-2.66-1.19-2.66-2.66s1.19-2.66 2.66-2.66 2.66 1.19 2.66 2.66-1.19 2.66-2.66 2.66zm6.336-7.37c-.78 0-1.42-.64-1.42-1.42s.64-1.42 1.42-1.42 1.42.64 1.42 1.42-.64 1.42-1.42 1.42z"/>
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);
