// Interactive Touch & Mouse Signature Canvas Pad
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, PenTool } from 'lucide-react';

export const SignaturePad = ({
  onSaveSignature,
  initialDataUrl = null,
  signatoryTitle = 'Authorized Signatory',
  signatoryName = '',
  disabled = false,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!initialDataUrl);
  const [signatureData, setSignatureData] = useState(initialDataUrl);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set line styles: Deep Midnight Navy Ink (#082052)
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#082052';

    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = initialDataUrl;
    }
  }, [initialDataUrl]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    if (disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    setSignatureData(dataUrl);
    if (onSaveSignature) onSaveSignature(dataUrl);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setSignatureData(null);
    if (onSaveSignature) onSaveSignature(null);
  };

  return (
    <div className={`p-3.5 rounded-xl border border-[#e2d5c1] dark:border-[#153675] bg-white dark:bg-[#082052] ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5] flex items-center">
            <PenTool className="w-3.5 h-3.5 text-[#C59B27] mr-1.5" />
            {signatoryTitle}
          </span>
          {signatoryName && (
            <span className="text-[11px] text-[#5a677a] dark:text-[#d8cebe] font-medium ml-5 block">
              {signatoryName}
            </span>
          )}
        </div>

        {!disabled && hasDrawn && (
          <button
            type="button"
            onClick={clearCanvas}
            className="text-[11px] text-rose-600 hover:text-rose-700 font-medium flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="relative border border-dashed border-[#C59B27]/40 dark:border-[#153675] rounded-lg overflow-hidden bg-[#faf6f0] dark:bg-[#041029] touch-none">
        <canvas
          ref={canvasRef}
          width={360}
          height={120}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[120px] cursor-crosshair block"
        />

        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[#7f8c9f] text-xs">
            Sign inside this box (Touch or Mouse)
          </div>
        )}

        <div className="absolute bottom-1 right-2 pointer-events-none text-[9px] text-[#082052]/50 dark:text-[#C59B27]/70 font-mono font-bold tracking-wider">
          DIGITAL ENDORSEMENT
        </div>
      </div>
    </div>
  );
};

export default SignaturePad;
