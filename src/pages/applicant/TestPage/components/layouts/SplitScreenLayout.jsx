import React from 'react';
import { Stack, Typography } from "@mui/material";
import PDFViewer from '../PDFViewer';
import QuestionCard from '../QuestionCard';
import SubmitButton from '../SubmitButton';

const SplitScreenLayout = ({
  quizData,
  questions,
  selectedAnswers,
  descriptiveAnswers,
  onAnswerSelect,
  onDescriptiveAnswer,
  isSubmitting,
  onSubmit,
  pdfLinks
}) => {
  const answeredCount = Object.keys(selectedAnswers).filter(k => 
    selectedAnswers[k] !== null && 
    selectedAnswers[k] !== undefined && 
    (Array.isArray(selectedAnswers[k]) ? selectedAnswers[k].length > 0 : true)
  ).length + Object.keys(descriptiveAnswers).filter(k => 
    descriptiveAnswers[k]?.trim()
  ).length;

  return (
    <div className="max-w-[1300px] mx-auto">
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

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 min-h-[calc(100vh-20rem)]">
        {/* PDF Viewer */}
        <PDFViewer pdfLinks={pdfLinks} />

        {/* Questions Panel */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col">
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-15rem)]">
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
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <SubmitButton 
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              label="Submit Quiz"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenLayout;