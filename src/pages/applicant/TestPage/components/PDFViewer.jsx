import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { getDirectPdfLink } from '../utils/pdfUtils';

const PDFViewer = ({ pdfLinks }) => {
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(null);
  const [pdfScale, setPdfScale] = useState(1.0);

  const currentPdfLink = pdfLinks[currentDocumentIndex] || null;
  const directPdfLink = getDirectPdfLink(currentPdfLink);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPdfLoading(false);
    setPdfError(null);
    setPageNumber(1);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setPdfError("Failed to load PDF document. You can still view it by opening the link in a new tab.");
    setPdfLoading(false);
  };

  const goToPreviousPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const goToPreviousDocument = () => {
    if (currentDocumentIndex > 0) {
      setCurrentDocumentIndex(prev => prev - 1);
      setPageNumber(1);
      setPdfLoading(true);
      setPdfError(null);
    }
  };

  const goToNextDocument = () => {
    if (currentDocumentIndex < pdfLinks.length - 1) {
      setCurrentDocumentIndex(prev => prev + 1);
      setPageNumber(1);
      setPdfLoading(true);
      setPdfError(null);
    }
  };

  const zoomIn = () => {
    setPdfScale((prev) => Math.min(prev + 0.25, 2.0));
  };

  const zoomOut = () => {
    setPdfScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setPdfScale(1.0);
  };

  if (pdfLinks.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden h-full max-h-screen">
      {/* PDF Header */}
      <div className="px-6 py-4 bg-cyan-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Reference Documents</h3>
              <p className="text-sm text-blue-100">
                Document {currentDocumentIndex + 1} of {pdfLinks.length}
              </p>
            </div>
          </div>
          
          {/* Document Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousDocument}
              disabled={currentDocumentIndex === 0}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              title="Previous Document"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-sm font-medium px-3 py-1 bg-white/20 rounded-md backdrop-blur-sm">
              {currentDocumentIndex + 1} / {pdfLinks.length}
            </span>
            
            <button
              onClick={goToNextDocument}
              disabled={currentDocumentIndex === pdfLinks.length - 1}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              title="Next Document"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar for Multiple Documents */}
        <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentDocumentIndex + 1) / pdfLinks.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 overflow-hidden bg-gray-900 flex flex-col">
        {pdfError ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center py-12 bg-white rounded-xl shadow-lg p-8 max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600 text-lg font-semibold mb-2">
                Failed to load PDF
              </p>
              <p className="text-gray-600 text-sm mb-4">{pdfError}</p>
              <a
                href={directPdfLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-sm"
              >
                Open PDF in New Tab
              </a>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* PDF Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="flex justify-center h-full">
                {directPdfLink && directPdfLink.includes("drive.google.com") ? (
                  <div className="bg-white rounded-lg shadow-2xl w-full h-full flex">
                    <iframe
                      src={directPdfLink}
                      width="100%"
                      height="100%"
                      style={{
                        border: "none",
                        borderRadius: "8px",
                        minHeight: "500px"
                      }}
                      title={`PDF Document ${currentDocumentIndex + 1}`}
                      onLoad={() => setPdfLoading(false)}
                      onError={() => {
                        setPdfError("Failed to load PDF.");
                        setPdfLoading(false);
                      }}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-2xl p-4 flex justify-center h-full overflow-auto">
                    <Document
                      file={directPdfLink}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      loading={
                        <div className="flex items-center justify-center py-20">
                          <div className="text-center">
                            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <span className="text-gray-700 text-sm font-medium">
                              Loading Document {currentDocumentIndex + 1}...
                            </span>
                          </div>
                        </div>
                      }
                    >
                      <Page 
                        pageNumber={pageNumber} 
                        scale={pdfScale}
                        loading={
                          <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
                          </div>
                        }
                      />
                    </Document>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;