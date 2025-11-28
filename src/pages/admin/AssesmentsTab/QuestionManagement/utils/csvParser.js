export const parseCSV = (text) => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) {
    throw new Error('CSV must have at least header and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  // Check required headers
  const requiredHeaders = ['question_text', 'question_type', 'points'];
  const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
  }

  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(',').map(v => v.trim());
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    // Basic validation
    if (!row.question_text) {
      console.warn(`Skipping row ${i + 1}: missing question_text`);
      continue;
    }

    const question = {
      question_text: row.question_text,
      question_type: (row.question_type || 'MC').toUpperCase(),
      points: parseInt(row.points) || 1,
      explanation: row.explanation || '',
      options: []
    };

    // Validate question type
    const validTypes = ['MC', 'CB', 'TF', 'DESC'];
    if (!validTypes.includes(question.question_type)) {
      console.warn(`Invalid question type "${question.question_type}" in row ${i + 1}, using MC`);
      question.question_type = 'MC';
    }

    // Handle different question types
    if (question.question_type === 'DESC') {
      // Descriptive question - use answer_text or option_1
      const answer = row.answer_text || row.option_1 || 'Sample answer';
      question.options = [
        { option_text: answer, is_correct: true }
      ];
    } 
    else if (question.question_type === 'TF') {
      // True/False question
      const trueCorrect = (row.is_correct_1 === 'true' || row.is_correct_1 === '1');
      question.options = [
        { option_text: 'True', is_correct: trueCorrect },
        { option_text: 'False', is_correct: !trueCorrect }
      ];
    }
    else {
      // MC or CB questions
      for (let optNum = 1; optNum <= 4; optNum++) {
        const optionText = row[`option_${optNum}`];
        if (optionText && optionText.trim()) {
          const isCorrect = (
            row[`is_correct_${optNum}`] === 'true' || 
            row[`is_correct_${optNum}`] === '1' ||
            row[`is_correct_${optNum}`] === 'yes'
          );
          question.options.push({
            option_text: optionText,
            is_correct: !!isCorrect
          });
        }
      }

      // Ensure at least 2 options for MC/CB
      if (question.options.length < 2) {
        question.options = [
          { option_text: 'Option 1', is_correct: true },
          { option_text: 'Option 2', is_correct: false }
        ];
      }
    }

    questions.push(question);
  }

  return questions;
};

export const downloadTemplate = () => {
  const template = `question_text,question_type,points,explanation,option_1,is_correct_1,option_2,is_correct_2,option_3,is_correct_3,option_4,is_correct_4
"What is the capital of France?",MC,1,"Paris is the capital",Paris,true,London,false,Berlin,false,Madrid,false
"Select all prime numbers",CB,2,"Numbers divisible by 1 and themselves",2,true,3,true,4,false,5,true
"JavaScript is a compiled language",TF,1,"It's an interpreted language",True,false,False,true,,
"Explain photosynthesis",DESC,2,"Process in plants","Photosynthesis converts light to chemical energy",true,,,,
"What is 2 + 2?",MC,1,"Basic math",4,true,5,false,6,false,,
"Select colors",CB,1,"Primary colors",Red,true,Blue,true,Green,false,Yellow,true`;

  const blob = new Blob([template], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quiz_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};