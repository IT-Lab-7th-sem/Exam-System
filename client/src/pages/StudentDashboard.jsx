import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosInstance';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [examsRes, submissionsRes] = await Promise.all([
          API.get('/exams'),
          API.get('/submissions/my')
        ]);
        setExams(examsRes.data);
        setSubmissions(submissionsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const hasSubmitted = (examId) => submissions.some((sub) => sub.exam?._id === examId);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Student Examination Portal</h1>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Available Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam._id} className="bg-white p-5 rounded-lg shadow-sm border flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{exam.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{exam.description}</p>
                <span className="inline-block mt-3 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded">
                  Duration: {exam.durationMinutes} mins
                </span>
              </div>
              <div className="mt-4">
                {hasSubmitted(exam._id) ? (
                  <span className="text-sm text-green-600 font-semibold">Already Submitted</span>
                ) : (
                  <Link
                    to={`/take-exam/${exam._id}`}
                    className="block text-center bg-indigo-600 text-white py-2 rounded text-sm font-semibold hover:bg-indigo-700"
                  >
                    Start Exam
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">My Exam Results</h2>
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.map((sub) => (
                <tr key={sub._id}>
                  <td className="px-6 py-4 text-sm font-medium">{sub.exam?.title || 'Exam'}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{sub.totalScore} / {sub.maxScore}</td>
                  <td className="px-6 py-4 text-sm text-indigo-600 font-bold">
                    {((sub.totalScore / sub.maxScore) * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;