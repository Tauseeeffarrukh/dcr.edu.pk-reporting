// Evidence Uploader with Camera simulation, file picking, and preview
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import uploadService from '../services/uploadService';

export const EvidenceUploader = ({
  evidenceList = [],
  onAddEvidence,
  onRemoveEvidence,
  section = 'general',
  label = 'Evidence & Attachments',
  maxItems = 6,
  disabled = false,
  className = '',
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captionInput, setCaptionInput] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const record = await uploadService.processUploadedFile(file, {
        section,
        caption: captionInput || file.name,
      });
      onAddEvidence(record);
      setCaptionInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleSimulateCameraCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const samples = uploadService.getSampleEvidenceList();
      const sample = samples[Math.floor(Math.random() * samples.length)];
      const record = {
        ...sample,
        id: `ev_${Date.now()}`,
        section,
        caption: captionInput || `Captured photo for ${section}`,
        uploadedAt: new Date().toISOString(),
      };
      onAddEvidence(record);
      setIsCapturing(false);
      setCaptionInput('');
    }, 600);
  };

  return (
    <div className={`p-3.5 rounded-xl border border-[#e2d5c1] dark:border-[#153675] bg-white dark:bg-[#082052] mb-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-[#082052] dark:text-[#F8F0E5]">
          {label} ({evidenceList.length}/{maxItems})
        </span>
        <span className="text-[10px] text-[#5a677a] dark:text-[#d8cebe] font-medium">Supports JPG, PNG, PDF</span>
      </div>

      {/* Upload & Camera Trigger Bar */}
      {!disabled && evidenceList.length < maxItems && (
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            value={captionInput}
            onChange={(e) => setCaptionInput(e.target.value)}
            placeholder="Add description / caption for this photo..."
            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#222d3d] dark:text-[#F8F0E5] focus:border-[#082052] focus:ring-1 focus:ring-[#082052] focus:outline-none"
          />

          <div className="flex gap-1.5 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-[#f8f0e5] dark:bg-[#041029] hover:bg-[#ede0ce] dark:hover:bg-[#0c2a68] text-[#082052] dark:text-[#F8F0E5] border border-[#e2d5c1] dark:border-[#153675] text-xs font-semibold flex items-center space-x-1"
            >
              <Upload className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Browse</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateCameraCapture}
              disabled={isCapturing}
              className="px-3 py-1.5 rounded-lg bg-[#082052] hover:bg-[#0e2e6e] text-[#F8F0E5] text-xs font-bold flex items-center space-x-1 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{isCapturing ? 'Snapping...' : 'Camera'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Evidence Thumbnails List */}
      {evidenceList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-lg overflow-hidden border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029]"
            >
              {item.dataUrl || item.url ? (
                <img
                  src={item.dataUrl || item.url}
                  alt={item.caption || 'Evidence'}
                  referrerPolicy="no-referrer"
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 flex flex-col items-center justify-center bg-[#f8f0e5] dark:bg-[#041029] text-[#7f8c9f]">
                  <ImageIcon className="w-6 h-6 mb-1 text-[#C59B27]" />
                  <span className="text-[10px]">{item.name || 'Document'}</span>
                </div>
              )}

              <div className="p-2 bg-white dark:bg-[#082052]">
                <div className="text-[11px] font-semibold text-[#222d3d] dark:text-[#F8F0E5] truncate">
                  {item.caption || item.name}
                </div>
                <div className="text-[9px] text-[#082052] dark:text-[#C59B27] font-bold flex items-center mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                  <span>{item.status || 'Attached'}</span>
                </div>
              </div>

              {!disabled && onRemoveEvidence && (
                <button
                  type="button"
                  onClick={() => onRemoveEvidence(item.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white opacity-90 hover:opacity-100 shadow-sm"
                  title="Remove file"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center border border-dashed border-[#e2d5c1] dark:border-[#153675] rounded-lg text-[#7f8c9f] text-xs">
          No photographic evidence attached yet.
        </div>
      )}
    </div>
  );
};

export default EvidenceUploader;
