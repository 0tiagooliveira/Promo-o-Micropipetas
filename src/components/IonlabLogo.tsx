import React from 'react';

interface IonlabLogoProps {
  variant?: 'colored' | 'white';
  className?: string;
  height?: number | string;
}

const LOGO_COLORED = 'https://mcusercontent.com/d315c990296355ed94752eef4/images/5d8d8375-6b54-8389-8099-6324bf62bab0.png';
const LOGO_WHITE = 'https://mcusercontent.com/d315c990296355ed94752eef4/images/127895f8-8478-f2ac-8209-266665c37965.png';

export const IonlabLogo: React.FC<IonlabLogoProps> = ({
  variant = 'colored',
  className = '',
  height = 68
}) => {
  const logoUrl = variant === 'white' ? LOGO_WHITE : LOGO_COLORED;
  const hStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <img
      src={logoUrl}
      alt="Ionlab Equipamentos Laboratoriais e Hospitalares Ltda."
      className={`object-contain max-w-full select-none ${className}`}
      style={{ height: hStyle }}
    />
  );
};

