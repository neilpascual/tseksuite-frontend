import React, { useState } from 'react';
import { X, Upload, Download, CheckCircle } from 'lucide-react';
import { parseCSV, downloadTemplate } from '../utils/csvParser';
import { addQuestion, addAnswer } from '../../../../../../api/api';
import toast from 'react-hot-toast';

const ImportModal = ({ isOpen, onClose, onImport, quizId }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.name.match(/\.(csv)$/i)) {
      toast.error("Please select a CSV file");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const questions = parseCSV(e.target.result);
        setPreviewData(questions);
        setStep(2);
        toast.success(`Found ${questions.length} questions to import`);
      } catch (error) {
        console.error('Parse error:', error);
        toast.error(`Error: ${error.message}`);
      }
    };
    reader.onerror = () => toast.error('Error reading file');
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast.error('No questions to import');
      return;
    }

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const questionData of previewData) {
        try {
          // Add question
          const { question_id } = await addQuestion(quizId, {
            question_text: questionData.question_text,
            question_type: questionData.question_type,
            points: questionData.points,
            explanation: questionData.explanation
          });
          
          // Add options
          for (const option of questionData.options) {
            await addAnswer(question_id, option);
          }
          
          successCount++;
        } catch (error) {
          console.error('Error importing question:', error);
          errorCount++;
        }
      }

      toast.success(`Imported ${successCount} questions successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`);
      setStep(3);
      onImport(successCount);
    } catch (error) {
      toast.error('Import failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setPreviewData([]);
    setStep(1);
    setLoading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 sm:p-5 bg-linear-to-r from-[#217486] to-[#2a8fa5] flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            Import Questions from CSV
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#217486]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-[#217486]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload CSV File
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a CSV file with your questions and answers.
                </p>
                
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 text-[#217486] border border-[#217486] rounded-lg hover:bg-[#217486]/10 transition-colors mx-auto mb-4"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#217486] transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="text-[#217486] font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    CSV files only
                  </p>
                </label>
              </div>

              {/* CSV Guide */}
              <div className="space-y-6 p-4 sm:p-6 overflow-y-auto">
                {/* Step-by-Step CSV Guide */}
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-400/20 text-yellow-700 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a2 2 0 110 4H7a2 2 0 110-4h10zM12 6v6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-900">Step-by-Step: Create Your CSV</h3>
                  </div>

                  <ol className="space-y-3 text-sm text-yellow-800 list-decimal list-inside">
                    <li>Open Excel, Google Sheets, or any spreadsheet editor.</li>
                    <li>Create the main columns: <code>question_text</code>, <code>question_type</code>, <code>points</code>.</li>
                    <li>For MC/CB questions, add: <code>option_1, is_correct_1, option_2, is_correct_2, ...</code>.</li>
                    <li>For True/False questions, only <code>is_correct_1</code> matters (true/false).</li>
                    <li>For Descriptive questions, use <code>option_1</code> or <code>answer_text</code>.</li>
                    <li>Fill in each row with your questions and answers.</li>
                    <li>Double-check columns and data for correctness.</li>
                    <li>Save/export as CSV format.</li>
                    <li>Upload your CSV in the system to import questions.</li>
                  </ol>

                  {/* Example Table */}
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-yellow-100 text-yellow-900 text-xs font-semibold uppercase">
                        <tr>
                          <th className="p-2 border">question_text</th>
                          <th className="p-2 border">question_type</th>
                          <th className="p-2 border">points</th>
                          <th className="p-2 border">option_1</th>
                          <th className="p-2 border">is_correct_1</th>
                          <th className="p-2 border">option_2</th>
                          <th className="p-2 border">is_correct_2</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 text-xs">
                        <tr className="bg-white border-b">
                          <td className="p-2 border">What is 2 + 2?</td>
                          <td className="p-2 border">MC</td>
                          <td className="p-2 border">5</td>
                          <td className="p-2 border">3</td>
                          <td className="p-2 border">false</td>
                          <td className="p-2 border">4</td>
                          <td className="p-2 border">true</td>
                        </tr>
                        <tr className="bg-gray-50 border-b">
                          <td className="p-2 border">The earth is flat?</td>
                          <td className="p-2 border">TF</td>
                          <td className="p-2 border">2</td>
                          <td className="p-2 border">True</td>
                          <td className="p-2 border">false</td>
                          <td className="p-2 border">False</td>
                          <td className="p-2 border">true</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CSV Format Reference */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-400/20 text-blue-700 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M4 12V5a2 2 0 012-2h12a2 2 0 012 2v7M8 21h8" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">CSV Format Reference</h3>
                  </div>

                  <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                    <li><strong>Required Columns:</strong> question_text, question_type, points</li>
                    <li><strong>Question Types:</strong> MC (Multiple Choice), CB (Checkbox), TF (True/False), DESC (Descriptive)</li>
                    <li><strong>MC/CB:</strong> option_1, is_correct_1, option_2, is_correct_2, ...</li>
                    <li><strong>TF:</strong> Only is_correct_1 matters (true = correct)</li>
                    <li><strong>DESC:</strong> Use option_1 or answer_text</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Preview Import ({previewData.length} questions)
              </h3>
              
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                {previewData.map((question, index) => (
                  <div key={index} className="p-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="w-6 h-6 bg-[#217486] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm mb-1">
                          {question.question_text}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-[#217486]/10 text-[#217486] rounded text-xs font-medium">
                            {question.question_type}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            {question.points} pts
                          </span>
                        </div>
                        <div className="space-y-1">
                          {question.options.map((opt, optIndex) => (
                            <div key={optIndex} className={`flex items-center gap-2 text-xs ${
                              opt.is_correct ? 'text-green-700 font-medium' : 'text-gray-600'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                opt.is_correct ? 'bg-green-500' : 'bg-gray-400'
                              }`} />
                              {opt.option_text}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleImport}
                  disabled={loading}
                  className="px-4 py-2 bg-[#217486] text-white rounded-lg hover:bg-[#1a5d6d] font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Importing...' : `Import ${previewData.length} Questions`}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Import Completed!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Your questions have been imported successfully.
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-[#217486] text-white rounded-lg hover:bg-[#1a5d6d] font-medium transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;