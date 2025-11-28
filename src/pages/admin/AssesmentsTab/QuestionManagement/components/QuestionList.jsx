import React from 'react';
import QuestionItem from './QuestionItem';

const QuestionList = ({ questions, onEdit, onDelete }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {questions.map((question, index) => (
        <QuestionItem
          key={question.question_id || index}
          question={question}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default QuestionList;