import React from 'react';
import { Stack, Typography } from "@mui/material";
import QuestionCard from '../QuestionCard';
import SubmitButton from '../SubmitButton';

const StandardTestLayout = ({
  quizData,
  questions,
  selectedAnswers,
  descriptiveAnswers,
  onAnswerSelect,
  onDescriptiveAnswer,
  isSubmitting,
  onSubmit
}) => {
  const answeredCount = Object.keys(selectedAnswers).filter(k => 
    selectedAnswers[k] !== null && 
    selectedAnswers[k] !== undefined && 
    (Array.isArray(selectedAnswers[k]) ? selectedAnswers[k].length > 0 : true)
  ).length + Object.keys(descriptiveAnswers).filter(k => 
    descriptiveAnswers[k]?.trim()
  ).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <Stack spacing={3}>
            <Typography
              sx={{
                color: "#1a1a1a",
                fontSize: { xs: 20, sm: 24, md: 28, lg: 32 },
                fontWeight: "bold",
                lineHeight: 1.3,
              }}
            >
              {quizData.quiz_name}
            </Typography>
            <div className="flex items-center justify-between">
              <Typography
                sx={{
                  color: "#4a5568",
                  fontSize: { xs: 12, sm: 15 },
                  lineHeight: 1.5,
                }}
              >
                {questions.length} questions • Answer all questions below
              </Typography>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {answeredCount} of {questions.length} answered
                </div>
              </div>
            </div>
          </Stack>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              index={index}
              selectedAnswers={selectedAnswers}
              descriptiveAnswers={descriptiveAnswers}
              onAnswerSelect={onAnswerSelect}
              onDescriptiveAnswer={onDescriptiveAnswer}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-8 border-t border-gray-200">
          <SubmitButton 
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            label="Submit Quiz"
          />
        </div>
      </div>
    </div>
  );
};

export default StandardTestLayout;