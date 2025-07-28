import React, { useContext } from 'react';
import { ThemeContext } from '../contexts';

interface McmLogoProps {
    className?: string;
}

const McmLogo: React.FC<McmLogoProps> = ({ className }) => {
    const { theme } = useContext(ThemeContext);

    // This applies a CSS filter to invert the logo color in dark mode.
    // It works best for single-color (e.g., black) logos.
    const imageStyle = {
        filter: theme === 'dark' ? 'invert(1) brightness(2)' : 'none',
    };

    return (
        <img
            src="/logo.png"
            alt="MCM Alerts Logo"
            className={className}
            style={imageStyle}
        />
    );
};

export default McmLogo;
