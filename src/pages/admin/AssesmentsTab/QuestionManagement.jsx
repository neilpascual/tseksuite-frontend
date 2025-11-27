import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowLeft,
  CheckCircle,
  Circle,
  FileText,
  Upload,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  addAnswer,
  addQuestion,
  deleteAnswer,
  deleteQuestion,
  getAnswers,
  getQuestions,
  updateAnswer,
  updateQuestion,
} from "../../../../api/api";

const QuestionModal = ({
  isOpen,
  onClose,
  question,
  setQuestion,
  onSave,
  isPdfTest,
  isProcessing,
}) => {
  if (!isOpen) return null;

  const updateField = (field, value) => {
    setQuestion((prev) => ({ ...prev, [field]: value }));
  };

  const updateOption = (index, field, value) => {
    setQuestion((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const addOption = () => {
    setQuestion((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          option_text: "",
          is_correct: prev.question_type === "DESC" ? true : false,
        },
      ],
    }));
  };

  const removeOption = (index) => {
    setQuestion((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const setCorrectAnswer = (index) => {
    if (question.question_type === "CB") {
      updateOption(index, "is_correct", !question.options[index].is_correct);
    } else if (
      question.question_type === "MC" ||
      question.question_type === "TF"
    ) {
      setQuestion((prev) => ({
        ...prev,
        options: prev.options.map((opt, i) => ({
          ...opt,
          is_correct: i === index,
        })),
      }));
    }
  };

  const handleTypeChange = (type) => {
    updateField("question_type", type);
    if (type === "TF") {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "True", is_correct: true },
          { option_text: "False", is_correct: false },
        ],
      }));
    } else if (type === "DESC") {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "", is_correct: true },
          { option_text: "", is_correct: true },
        ],
      }));
    } else {
      setQuestion((prev) => ({
        ...prev,
        options: [
          { option_text: "", is_correct: true },
          { option_text: "", is_correct: false },
        ],
      }));
    }
  };

  const renderOptions = () => {
    switch (question.question_type) {
      case "DESC":
        return (
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 mb-2">
                <span className="font-semibold">Note:</span> This is a
                descriptive question. Enter the correct/expected answer below.
              </p>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Correct Answers
              </label>
              <div className="space-y-2">
                {question.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt.option_text}
                      onChange={(e) =>
                        updateOption(i, "option_text", e.target.value)
                      }
                      placeholder={`Key Answer ${i + 1}`}
                      className="flex-1 px-2.5 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent"
                    />
                    {question.options.length > 2 && (
                      <button
                        onClick={() => removeOption(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="w-full py-2 text-sm sm:text-base border-2 border-dashed border-gray-300 rounded-lg hover:border-[#217486] hover:bg-gray-50 text-gray-600 transition-colors"
                >
                  + Add Option
                </button>
              </div>
            </div>
          </div>
        );
      case "TF":
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#217486] transition-colors"
              >
                <input
                  type="radio"
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-[#217486] focus:ring-[#217486] shrink-0"
                />
                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  {opt.option_text}
                </span>
              </div>
            ))}
          </div>
        );
      case "MC":
      case "CB":
        return (
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type={question.question_type === "MC" ? "radio" : "checkbox"}
                  checked={opt.is_correct}
                  onChange={() => setCorrectAnswer(i)}
                  className="w-4 h-4 text-[#217486] focus:ring-[#217486] shrink-0"
                />
                <input
                  value={opt.option_text}
                  onChange={(e) =>
                    updateOption(i, "option_text", e.target.value)
                  }
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-2.5 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent"
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addOption}
              className="w-full py-2 text-sm sm:text-base border-2 border-dashed border-gray-300 rounded-lg hover:border-[#217486] hover:bg-gray-50 text-gray-600 transition-colors"
            >
              + Add Option
            </button>
          </div>
        );
      default:
        return (
          <p className="italic text-gray-500 text-sm">Unsupported type.</p>
        );
    }
  };

  const questionTypes = ["MC", "CB", "TF", "DESC"];

  const getTypeLabel = (type) => {
    switch (type) {
      case "MC":
        return "Multiple Choice";
      case "CB":
        return "Checkbox";
      case "TF":
        return "True/False";
      case "DESC":
        return "Descriptive";
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-5 bg-linear-to-r from-[#217486] to-[#2a8fa5] flex justify-between items-center">
          <h2 className="text-lg sm:text-2xl font-bold text-white">
            {question.question_id ? "Edit Question" : "Add New Question"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Question Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {questionTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    question.question_type === t
                      ? "bg-[#217486] text-white shadow-lg shadow-[#217486]/30"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {getTypeLabel(t)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Question Text
            </label>
            <textarea
              placeholder="Enter your question here..."
              value={question.question_text}
              onChange={(e) => updateField("question_text", e.target.value)}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Points
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="number"
                min={1}
                value={question.points}
                onChange={(e) => updateField("points", Number(e.target.value))}
                className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg w-24 focus:ring-2 focus:ring-[#217486] focus:border-transparent"
              />
              {question.question_type === "CB" && (
                <span className="text-xs text-gray-600 bg-cyan-50 border border-cyan-600 p-2 sm:p-3 rounded-lg">
                  <span className="font-semibold text-gray-800">Note: </span>
                  Each correct answer is equivalent to the points allocated.
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              {question.question_type === "DESC"
                ? "Expected Answers"
                : "Answer Options"}
            </label>
            {renderOptions()}
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
              Explanation (Optional)
            </label>
            <textarea
              placeholder="Add an explanation for the correct answer..."
              value={question.explanation || ""}
              onChange={(e) => updateField("explanation", e.target.value)}
              className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#217486] focus:border-transparent resize-none"
              rows={2}
            />
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-gray-50 border-t flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-[#217486] text-white rounded-lg hover:bg-[#1a5d6d] font-medium transition-colors shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
            disabled={isProcessing}
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteModal = ({ isOpen, onClose, onConfirm, questionText }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl mx-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
          Delete Question
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Are you sure you want to delete this question?
          <br />
          <span className="font-semibold text-gray-800 mt-2 block wrap-break-word">
            "{questionText}"
          </span>
        </p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg shadow-red-600/30 text-sm sm:text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ImportModal = ({ isOpen, onClose, onImport, quizId }) => {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  // Simple CSV parser
  const parseCSV = (text) => {
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

  const downloadTemplate = () => {
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">CSV Format:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li><strong>Required:</strong> question_text, question_type, points</li>
                  <li><strong>Types:</strong> MC, CB, TF, DESC</li>
                  <li><strong>For MC/CB:</strong> option_1, is_correct_1, option_2, is_correct_2, etc.</li>
                  <li><strong>For TF:</strong> Only is_correct_1 matters (true=Correct is True)</li>
                  <li><strong>For DESC:</strong> Use option_1 or answer_text for the answer</li>
                </ul>
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

const QuestionManagement = ({ quiz, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const isPdfTest = quiz?.pdf_link ? true : false;

  const emptyQuestion = {
    question_text: "",
    question_type: "MC",
    points: 1,
    explanation: "",
    options: [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
  };

  useEffect(() => {
    if (quiz?.quiz_id) fetchQuestions();
  }, [quiz?.quiz_id]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const questionsRes = await getQuestions(quiz.quiz_id);
      const answersRes = await getAnswers(quiz.quiz_id);

      const answersByQuestion = {};
      answersRes.forEach((answer) => {
        if (!answersByQuestion[answer.question_id]) {
          answersByQuestion[answer.question_id] = [];
        }
        answersByQuestion[answer.question_id].push(answer);
      });

      const withOptions = questionsRes.map((q) => {
        let options = answersByQuestion[q.question_id] || [];

        if (q.question_type === "DESC" && options.length === 0) {
          options = [{ option_text: "", is_correct: true }];
        }

        return { ...q, options };
      });

      setQuestions(withOptions);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setCurrentQuestion({ ...emptyQuestion });
    setEditingIndex(null);
    setModalOpen(true);
  };

  const openEdit = (i) => {
    setCurrentQuestion(JSON.parse(JSON.stringify(questions[i])));
    setEditingIndex(i);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    const question = questions[deleteIndex];
    try {
      await deleteQuestion(quiz.quiz_id, question.question_id);
      toast.success("Question Deleted!");
      setDeleteModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Question Deletion Failed!");
    }
  };

  const handleSave = async () => {
    const q = currentQuestion;
    if (!q.question_text.trim()) return toast.error("Question text required");

    if (
      (q.question_type === "MC" || q.question_type === "CB") &&
      (!q.options || q.options.length < 2)
    ) {
      return toast.error("At least 2 options are required");
    }

    setIsProcessing(true);

    try {
      if (editingIndex !== null) {
        await updateQuestion(quiz.quiz_id, q.question_id, q);
        toast.success("Question Updated!");

        const originalOptions = questions[editingIndex].options || [];
        const originalIds = originalOptions
          .map((o) => o.answer_id)
          .filter(Boolean);

        for (const opt of q.options) {
          if (opt.answer_id) await updateAnswer(opt.answer_id, opt);
          else await addAnswer(q.question_id, opt);
        }

        for (const oldId of originalIds) {
          if (!q.options.find((o) => o.answer_id === oldId))
            await deleteAnswer(oldId);
        }
      } else {
        const { question_id } = await addQuestion(quiz.quiz_id, q);
        toast.success("Question Added!");
        for (const opt of q.options) {
          await addAnswer(question_id, opt);
        }
      }

      setModalOpen(false);
      fetchQuestions();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save question");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportComplete = (importedCount) => {
    setImportModalOpen(false);
    if (importedCount > 0) {
      fetchQuestions();
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "MC":
        return "Multiple Choice";
      case "CB":
        return "Checkbox";
      case "TF":
        return "True/False";
      case "DESC":
        return "Descriptive";
      default:
        return type;
    }
  };

  const getTotalPoints = () => {
    return questions.reduce((sum, q) => {
      if (q.question_type === "CB") {
        const correctAnswersCount =
          q.options?.filter((opt) => opt.is_correct === true).length || 0;
        return sum + q.points * correctAnswersCount;
      }

      return sum + (q.points || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#217486] mb-4 font-medium transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Back to Quizzes</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 sm:mt-10">
            <div>
              <h1 className="text-2xl sm:text-3xl text-[#217486] mb-2 wrap-break-word">
                {quiz.quiz_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                {isPdfTest && (
                  <span className="flex items-center gap-1 bg-[#2a8fa5]/10 px-2 py-1 rounded-lg">
                    <span className="font-semibold text-[#2a8fa5]">
                      PDF Test
                    </span>
                  </span>
                )}
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <span className="font-semibold text-[#217486]">
                    {getTotalPoints()}
                  </span>
                  {getTotalPoints() === 1 ? "Point" : "Points"}
                </span>
                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                  <span className="font-semibold text-[#217486]">
                    {questions.length}
                  </span>
                  {questions.length === 1 ? "Question" : "Questions"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setImportModalOpen(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white text-[#217486] border border-[#217486] rounded-xl hover:bg-[#217486]/10 font-medium transition-all text-sm sm:text-base whitespace-nowrap"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import CSV</span>
                <span className="sm:hidden">Import</span>
              </button>
              <button
                onClick={openAdd}
                className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all hover:shadow-xl hover:shadow-[#217486]/40 text-sm sm:text-base whitespace-nowrap"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Question</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="animate-pulse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#217486]/20 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">
                Loading questions...
              </p>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-[#217486]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-[#217486]" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No Questions Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              Start building your {isPdfTest ? "test" : "quiz"} by adding your
              first question.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setImportModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-[#217486] border border-[#217486] rounded-xl hover:bg-[#217486]/10 font-medium transition-all text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                Import from CSV
              </button>
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#217486] text-white rounded-xl hover:bg-[#1a5d6d] font-medium transition-all shadow-lg shadow-[#217486]/30 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add First Question
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3 mb-3">
                        <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-[#217486] text-white rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm">
                          {i + 1}
                        </span>
                        <h3 className="font-semibold text-base sm:text-lg text-gray-800 leading-tight wrap-break-word">
                          {q.question_text}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-9 sm:ml-11 mb-3">
                        <span className="px-2.5 sm:px-3 py-1 bg-[#217486]/10 text-[#217486] rounded-lg text-xs font-semibold">
                          {getTypeLabel(q.question_type)}
                        </span>
                        <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                          {q.points} {q.points === 1 ? "point" : "points"}
                        </span>
                      </div>

                      <div className="ml-9 sm:ml-11 space-y-2">
                        {q.question_type === "DESC" ? (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-semibold text-blue-900 mb-1">
                              Expected Answers:
                            </p>
                            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                              {q.options && q.options.length > 0 ? (
                                q.options.map((opt, index) => (
                                  <li key={index} className="wrap-break-word">
                                    {opt.option_text}
                                  </li>
                                ))
                              ) : (
                                <li className="list-none">
                                  No answer provided
                                </li>
                              )}
                            </ul>
                          </div>
                        ) : (
                          q.options.map((opt, j) => (
                            <div
                              key={j}
                              className={`flex items-start gap-2 text-xs sm:text-sm p-2 rounded-lg ${
                                opt.is_correct
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-gray-50"
                              }`}
                            >
                              {opt.is_correct ? (
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                              )}
                              <span
                                className={`break-words ${
                                  opt.is_correct
                                    ? "text-green-800 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {opt.option_text}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {q.explanation && (
                        <div className="ml-9 sm:ml-11 mt-3 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs sm:text-sm text-blue-900 wrap-break-word">
                            <span className="font-semibold">Explanation: </span>
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2 ml-4 sm:ml-4">
                      <button
                        onClick={() => openEdit(i)}
                        className="flex-1 sm:flex-none p-2 sm:p-2.5 text-[#217486] hover:bg-[#217486]/10 rounded-lg transition-colors"
                        title="Edit Question"
                      >
                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteIndex(i);
                          setDeleteModalOpen(true);
                        }}
                        className="flex-1 sm:flex-none p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <QuestionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          question={currentQuestion}
          setQuestion={setCurrentQuestion}
          onSave={handleSave}
          isPdfTest={isPdfTest}
          isProcessing={isProcessing}
        />

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          questionText={questions[deleteIndex]?.question_text}
        />

        <ImportModal
          isOpen={importModalOpen}
          onClose={() => setImportModalOpen(false)}
          onImport={handleImportComplete}
          quizId={quiz.quiz_id}
        />
      </div>
    </div>
  );
};

export default QuestionManagement;