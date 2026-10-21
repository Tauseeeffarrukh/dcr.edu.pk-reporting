// Evidence Upload and Document Handling Service

export const uploadService = {
  /**
   * Reads a local file from an input event or simulated capture
   * Converts to base64 Data URL for offline preview & persistence
   */
  processUploadedFile: (file, meta = {}) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(new Error('No file provided'));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const evidenceRecord = {
          id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          name: file.name || `capture_${Date.now()}.jpg`,
          size: file.size,
          type: file.type || 'image/jpeg',
          dataUrl: e.target.result,
          section: meta.section || 'general',
          field: meta.field || '',
          caption: meta.caption || '',
          uploadedBy: meta.uploadedBy || 'Monitoring Officer',
          uploadedAt: new Date().toISOString(),
          status: 'Verified',
        };
        resolve(evidenceRecord);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Provides placeholder pre-curated school assets for one-click testing
   */
  getSampleEvidenceList: () => [
    {
      id: 'samp_01',
      name: 'science_lab_setup.jpg',
      type: 'image/jpeg',
      section: 'facilities',
      caption: 'Science Laboratory apparatus and student seating',
      dataUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop',
      uploadedBy: 'Monitoring Officer',
      uploadedAt: new Date().toISOString(),
      status: 'Verified',
    },
    {
      id: 'samp_02',
      name: 'assembly_and_ground.jpg',
      type: 'image/jpeg',
      section: 'presentation',
      caption: 'Clean school ground and morning assembly discipline',
      dataUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop',
      uploadedBy: 'Monitoring Officer',
      uploadedAt: new Date().toISOString(),
      status: 'Verified',
    },
    {
      id: 'samp_03',
      name: 'classroom_softboards.jpg',
      type: 'image/jpeg',
      section: 'class_eval',
      caption: 'Updated classroom softboards with student art and academic themes',
      dataUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop',
      uploadedBy: 'Monitoring Officer',
      uploadedAt: new Date().toISOString(),
      status: 'Verified',
    },
  ],
};

export default uploadService;
