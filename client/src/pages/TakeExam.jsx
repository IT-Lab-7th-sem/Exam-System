import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const { data } = await API.get(`/exams/${id}`);
        setExam(data);
        setTimeLeft(data.durationMinutes * 60);
      } catch (err) {
        alert('Could not load exam');
        navigate('/student');
      }
    };
    fetchExam();
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(([qIdx, optIdx]) => ({
      questionIndex: Number(qIdx),
      selectedOptionIndex: optIdx
    }));

    try {
      await API.post('/submissions', {
        examId: id,
        answers: formattedAnswers
      });
      alert('Exam submitted successfully!');
      navigate('/student');
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    }
  };

  if (!exam) return <div className="p-8 text-center">Loading examination content...</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded shadow border sticky top-2 z-10">
        <h1 className="text-xl font-bold">{exam.title}</h1>
        <span className="text-red-600 font-mono font-bold text-lg">
          Time Left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </div>

      <div className="space-y-6">
        {exam.questions.map((q, qIndex) => (
          <div key={q._id || qIndex} className="bg-white p-6 rounded shadow-sm border">
            <h3 className="font-semibold text-gray-800 mb-3">
              {qIndex + 1}. {q.questionText}
            </h3>
            <div className="space-y-2">
              {q.options.map((option, optIndex) => (
                <label
                  key={optIndex}
                  className={`flex items-center p-3 border rounded cursor-pointer transition ${
                    answers[qIndex] === optIndex ? 'border-indigo-600 bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === optIndex}
                    onChange={() => handleOptionSelect(qIndex, optIndex)}
                    className="mr-3 text-indigo-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow transition"
      >
        Submit Assessment
      </button>
    </div>
  );
};

export default TakeExam;