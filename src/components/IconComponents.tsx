import React from 'react';

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" 
    />
  </svg>
);


export const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5a6 6 0 00-12 0v1.5a6 6 0 006 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v6" />
    </svg>
);

export const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

export const EndCallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
    >
        <path fillRule="evenodd" stroke="none" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.292-.088.442.273.442.585.877.92 1.284.335.407.77.719 1.284.92.15.076.341.047.442-.088l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C6.55 22.5 1.5 17.45 1.5 10.5V4.5z" clipRule="evenodd" />
    </svg>
);

export const InterviewIllustrationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.375 1.493l-2.036 3.476" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17.25v1.007a3 3 0 00.375 1.493l2.036 3.476" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75h.01" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12.75h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75v6a3 3 0 003 3h9a3 3 0 003-3v-6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 6.375a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75zM13.875 6.375a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75a3.375 3.375 0 00-3.375 3.375v1.5a1.125 1.125 0 01-2.25 0v-1.5A5.625 5.625 0 0112 7.125a5.625 5.625 0 015.625 5.625v1.5a1.125 1.125 0 01-2.25 0v-1.5A3.375 3.375 0 0012 9.75z" />
    </svg>
);