export const formatAttachements = (attachements: any[]) => {
    // console.log('attach:',attachements);
  return attachements.map((a: any) => ({
    _id: a._id,
    originalName: a.originalName,
    mimeType: a.mimeType,
    size: formatFileSize(a.size),
    type: a.type,

    previewUrl: `${process.env.BACKEND_URL}/api/attachements/${a._id}`,

    downloadUrl: `${process.env.BACKEND_URL}/api/attachements/${a._id}/download`,
  }));
};

 function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}