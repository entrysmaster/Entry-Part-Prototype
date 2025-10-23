
import React from 'react';

interface QRCodeComponentProps {
  value: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ value }) => {
  // A simple SVG to represent a QR code for demonstration purposes.
  // In a real app, a library like qrcode.react would be used here.
  return (
    <div className="p-2 bg-white border rounded-lg inline-block">
        <svg width="128" height="128" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="0" y="0" width="40" height="40" fill="#ffffff" />
            <rect x="4" y="4" width="8" height="8" fill="#000000"/>
            <rect x="28" y="4" width="8" height="8" fill="#000000"/>
            <rect x="4" y="28" width="8" height="8" fill="#000000"/>
            <rect x="14" y="10" width="2" height="2" fill="#000000"/>
            <rect x="24" y="20" width="2" height="2" fill="#000000"/>
            <rect x="18" y="14" width="4" height="4" fill="#000000"/>
            <rect x="26" y="26" width="6" height="2" fill="#000000"/>
            <rect x="16" y="28" width="2" height="6" fill="#000000"/>
            <rect x="30" y="14" width="2" height="8" fill="#000000"/>
            <rect x="14" y="32" width="8" height="2" fill="#000000"/>
        </svg>
        <p className="text-center text-xs text-slate-500 mt-1 truncate" title={value}>{value}</p>
    </div>
  );
};

export default QRCodeComponent;
