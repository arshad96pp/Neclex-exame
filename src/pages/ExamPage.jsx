import React from "react";
import { useNavigate } from "react-router-dom";

const ExamPage = () => {
    const navigate=useNavigate()
  
  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-12">
      {/* Main Result Container */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Score Section */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            Congratulations!
          </h1>
          <p className="text-lg text-gray-700">You completed the exam</p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="text-6xl font-bold text-green-600">85%</div>
            <div className="text-xl text-gray-600">Score</div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Performance Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-gray-700">Correct Answers</h3>
              <p className="text-lg text-blue-600">40/50</p>
            </div>
            <div className="bg-red-50 p-4 rounded-md shadow-sm">
              <h3 className="font-medium text-gray-700">Incorrect Answers</h3>
              <p className="text-lg text-red-600">10/50</p>
            </div>
          </div>
        </div>

        {/* Feedback / Additional Info */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Feedback & Suggestions
          </h2>
          <p className="text-lg text-gray-600">
            Well done! You did an excellent job on the exam. Review the
            incorrect answers and try to improve your score next time. Keep
            practicing!
          </p>
        </div>

        {/* Buttons to Retake Exam or Go Home */}
        <div className="flex justify-between gap-4">
          <button onClick={()=>navigate('/')} className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition">
            Retake Exam
          </button>
          <button onClick={()=>navigate('/')} className="w-full sm:w-auto bg-gray-600 text-white py-2 px-6 rounded-lg shadow hover:bg-gray-700 transition">
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
