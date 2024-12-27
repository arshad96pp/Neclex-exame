import React from "react";
import ExamPage from "./pages/ExamPage";
import { Route, Routes } from "react-router-dom";
import NursingTestUI from "./pages/NursingTestUI";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<NursingTestUI />} />
      <Route path="/result" element={<ExamPage />} />
    </Routes>
  );
};
//
export default App;
