import React from "react";
import ExamPage from "./pages/ExamPage";
import { Route, Routes } from "react-router-dom";
import NursingTestUI from "./pages/NursingTestUI";

const App = () => {
  const getParamsFromURL = () => {
    const query = window.location.search; // Get the query string (e.g., ?token=...&language=en)
    const params = new URLSearchParams(query); // Parse the query string

    // Extract the 'token' parameter
    // const token = params.get("token")?.replace(/^"|"$/g, ""); // Remove leading and trailing quotes if they exist
    const userId = params.get("user_id")?.replace(/^"|"$/g, ""); // Remove leading and trailing quotes if they exist

    // Extract the 'language' parameter
    const examId = params.get("exam_id")

    return { userId, examId }; // Return both values as an object
  };
  const {userId,examId}=getParamsFromURL()

  
  return (
    <Routes>
      <Route path="/" element={<NursingTestUI userId={userId} examId={examId}/>} />
      <Route path="/result" element={<ExamPage />} />
    </Routes>
  );
};
//
export default App;
