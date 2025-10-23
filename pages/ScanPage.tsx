import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Part } from '../types';
import { CameraIcon } from '../components/icons';
// NOTE: In a real application, a library like 'jsqr' would be used.
// For this environment, we will simulate the scanning process.
// import jsQR from 'jsqr'; 

const ScanPage: React.FC = () => {
  const { parts, checkOutPart, currentUser } = useAppContext();
  const [scannedPart, setScannedPart] = useState<Part | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Start camera stream
  const startCamera = async () => {
    setError(null);
    setSuccess(null);
    setScannedPart(null);
    setIsScanning(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Could not access camera. Please check permissions.');
        setIsScanning(false);
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Simulate scanning
  useEffect(() => {
    let timeoutId: number;
    if (isScanning && !scannedPart) {
      timeoutId = window.setTimeout(() => {
        // Simulate finding a QR code for an existing part
        const randomPart = parts[Math.floor(Math.random() * parts.length)];
        const foundPart = parts.find(p => p.qrCode === randomPart.qrCode);
        
        if (foundPart) {
          setScannedPart(foundPart);
          setIsScanning(false);
          setError(null);
          stopCamera();
        } else {
          setError("Invalid or unknown QR code.");
        }
      }, 3000); // Simulate a 3-second scan
    }
    return () => clearTimeout(timeoutId);
  }, [isScanning, parts, scannedPart]);


  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedPart && currentUser && quantity > 0) {
      if (quantity > scannedPart.quantity) {
        setError(`Not enough stock. Only ${scannedPart.quantity} available.`);
        return;
      }
      checkOutPart(scannedPart.id, quantity, currentUser.id);
      setSuccess(`${quantity} of ${scannedPart.name} checked out successfully!`);
      setScannedPart(null);
    }
  };

  const handleScanAnother = () => {
    startCamera();
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-full flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Scan to Check Out</h1>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{error}</p></div>}
        {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{success}</p></div>}

        {isScanning && (
          <div className="text-center">
            <div className="relative w-full aspect-square bg-slate-900 rounded-lg overflow-hidden mb-4">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2/3 h-2/3 border-4 border-dashed border-white opacity-50 rounded-lg"/>
              </div>
            </div>
            <p className="text-slate-600 animate-pulse">Searching for QR code...</p>
          </div>
        )}
        
        {scannedPart && (
          <form onSubmit={handleCheckout}>
            <h2 className="text-xl font-bold text-slate-800 mb-1">{scannedPart.name}</h2>
            <p className="font-mono text-xs text-slate-500 mb-2">{scannedPart.sku}</p>
            <p className="text-slate-500 mb-1">Category: {scannedPart.category}</p>
            <p className="text-slate-500 mb-4">In Stock: <span className="font-bold">{scannedPart.quantity}</span></p>

            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantity to Check Out</label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                min="1"
                max={scannedPart.quantity}
                className="w-full p-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Confirm Checkout</button>
          </form>
        )}

        {(!isScanning || success) && (
            <button onClick={handleScanAnother} className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                <CameraIcon className="w-5 h-5 mr-2" />
                Scan Another Part
            </button>
        )}
      </div>
    </div>
  );
};

export default ScanPage;