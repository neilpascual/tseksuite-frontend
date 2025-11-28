import React from 'react';
import { Stack, Typography } from "@mui/material";
import PDFViewer from '../PDFViewer';
import SubmitButton from '../SubmitButton';

const PDFTestLayout = ({ quizData, timeRemaining, isSubmitting, onSubmit, pdfLinks }) => (
  <div className="flex-1 px-6 sm:px-12 lg:px-24 xl:px-32 pb-12">
    <div className="max-w-[1800px] mx-auto">
      <div className="mb-6">
        <Stack spacing={3}>
          <Typography
            sx={{
              color: "#1a1a1a",
              fontSize: { xs: 20, sm: 24, md: 28, lg: 32 },
              fontWeight: "bold",
              lineHeight: 1.3,
            }}
          >
            PDF Test: {quizData.quiz_name}
          </Typography>
          <Typography
            sx={{
              color: "#4a5568",
              fontSize: { xs: 16, sm: 18 },
              lineHeight: 1.5,
            }}
          >
            Please review the PDF documents below. When you're ready, click the submit button to complete the test.
          </Typography>
        </Stack>
      </div>

      <PDFViewer pdfLinks={pdfLinks} />

      <div className="flex justify-end pt-6">
        <SubmitButton 
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          label="Submit Test"
        />
      </div>
    </div>
  </div>
);

export default PDFTestLayout;