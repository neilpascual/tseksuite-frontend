export const isValidURL = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

export const validateQuiz = (quiz, isPdfTest = false) => {
  if (!quiz.quiz_name.trim()) {
    return 'Please enter a quiz name';
  }

  if (!isPdfTest && !quiz.time_limit) {
    return 'Please enter time limit for standard quiz';
  }

  if (isPdfTest) {
    const validLinks = quiz.pdf_links.filter((link) => link.trim() !== '');
    if (validLinks.length === 0) {
      return 'Please enter at least one PDF link';
    }

    for (const link of validLinks) {
      if (!isValidURL(link.trim())) {
        return 'Please enter valid URLs for all PDF links';
      }
    }
  }

  return null;
};