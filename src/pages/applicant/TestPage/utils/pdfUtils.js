export const getPdfLinks = (quizData) => {
  if (!quizData?.pdf_link) return [];
  
  if (Array.isArray(quizData.pdf_link)) {
    return quizData.pdf_link;
  } else if (typeof quizData.pdf_link === 'string') {
    return quizData.pdf_link.split(',').map(link => link.trim()).filter(link => link);
  }
  
  return [];
};

export const getDirectPdfLink = (driveLink) => {
  if (!driveLink) return null;

  const match = driveLink.match(/\/d\/([^\/]+)/);
  if (match) {
    const fileId = match[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return driveLink;
};