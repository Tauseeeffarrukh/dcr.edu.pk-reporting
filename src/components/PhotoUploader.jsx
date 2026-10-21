// PhotoUploader: Compact inline photo uploader for field-level evidence
// Redesigned with Etoile Palette: #082052 (Deep Midnight Navy), #F8F0E5 (Warm Alabaster), #C59B27 (Gold)
import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Check } from 'lucide-react';
import uploadService from '../services/uploadService';

export const PhotoUploader = ({
  photoUrl,
  onPhotoUploaded,
  fieldName = '',
  disabled = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const record = await uploadService.processUploadedFile(file, { field: fieldName });
      onPhotoUploaded(record.dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateSnap = () => {
    const samples = uploadService.getSampleEvidenceList();
    const sample = samples[Math.floor(Math.random() * samples.length)];
    onPhotoUploaded(sample.dataUrl);
  };

  return (
    <div className="inline-flex items-center space-x-1.5">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {photoUrl ? (
        <div className="relative group">
          <img
            src={photoUrl}
            alt="Field Evidence"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-lg border border-[#C59B27] object-cover"
          />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#082052] rounded-full flex items-center justify-center text-[#F8F0E5]">
            <Check className="w-2.5 h-2.5 text-[#C59B27]" />
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={handleSimulateSnap}
          title="Attach photo evidence"
          className="p-1.5 rounded-md border border-[#e2d5c1] dark:border-[#153675] bg-[#faf6f0] dark:bg-[#041029] text-[#5a677a] dark:text-[#d8cebe] hover:text-[#082052] hover:border-[#082052] transition-colors"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default PhotoUploader;
