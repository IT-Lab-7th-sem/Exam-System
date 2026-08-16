import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const ExaminerDashboard = () => {
  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, marks: 1 }
  ]);

  const fetchExams = async () => {
    try {
      const { data } = await API.get('/exams');
      setExams(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, marks: 1 }
    ]);
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      await API.post('/exams', {
        title,
        description,
        durationMinutes: Number(durationMinutes),
        questions
      });
      alert('Exam created successfully!');
      setTitle('');
      setDescription('');
      setDurationMinutes(30);
      setQuestions([{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, marks: 1 }]);
      fetchExams();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create exam');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Examiner Portal</h1>

      {/* Exam Creator Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Create New Exam</h2>
        <form onSubmit={handleCreateExam} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Exam Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (in Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              rows={2}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Questions</h3>
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-gray-50 p-4 rounded mb-4 border border-gray-200">
                <div className="mb-2">
                  <label className="block text-xs font-bold uppercase mb-1">Question {qIndex + 1}</label>
                  <input
                    type="text"
                    placeholder="Enter question text"
                    value={q.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    className="w-full border rounded p-2 bg-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                      className="border rounded p-2 text-sm bg-white"
                      required
                    />
                  ))}
                </div>
                <div className="flex gap-4 items-center mt-2">
                  <label className="text-xs font-semibold">Correct Option Index (0-3):</label>
                  <select
                    value={q.correctOptionIndex}
                    onChange={(e) => handleQuestionChange(qIndex, 'correctOptionIndex', Number(e.target.value))}
                    className="border rounded p-1 text-sm bg-white"
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddQuestion}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded"
            >
              + Add Question
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700"
          >
            Publish Exam
          </button>
        </form>
      </div>

      {/* Available Exams Listing */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Published Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <div key={exam._id} className="p-4 border rounded shadow-sm">
              <h3 className="font-bold text-lg">{exam.title}</h3>
              <p className="text-gray-600 text-sm">{exam.description}</p>
              <p className="text-xs text-gray-500 mt-2">Duration: {exam.durationMinutes} mins</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExaminerDashboard;