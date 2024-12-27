import React, { useEffect, useState } from "react";
import { Button, message, Radio } from "antd";
import MultipleChoiceQuestion from "../components/exam/MultipleChoiceQuestion";
import MatrixMultipleChoiceQuestion from "../components/exam/MatrixMultipleChoiceQuestion";
import MultipleResponseSelectQuestion from "../components/exam/MultipleResponseSelectQuestion";
import MultipleResponseSelectApplyQuestion from "../components/exam/MultipleResponseSelectApplyQuestion";
import { examData } from "../service/exams";
import { getQuestions } from "../api";
import Header from "../components/header/Header";
import { Modal, Input } from "antd";
import ModalCompo from "../components/Modal/ModalCompo";
import DOMPurify from "dompurify";
import axios from "axios";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { useNavigate } from "react-router-dom";
import CalculatorModal from "../components/CalculatorModal/CalculatorModal";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import SuspendPopup from "../components/PopupsEnd/SuspendPopup";
import EndExamModal from "../components/PopupsEnd/EndExamModal";

const NursingTestUI = () => {
  const [next, setNext] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0); // Track the current question index
  const [responses, setResponses] = useState({}); // Store user responses
  const [exams, setExam] = useState({});
  const { exam } = exams;

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [textModal, setTextModal] = useState(false);
  const [FeedbackModal, setFeedBackModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suspendModal, setSuspentModal] = useState(false);
  const [endExameModal, setEndExamModal] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({
    "Statement 1": "",
    "Statement 2": "",
    "Statement 3": "",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);

  const navigate = useNavigate();

  let user_id = 4;
  let exam_id = 3;

  const resizeHandeler = () => {
    setIsMobile(window.innerWidth <= 800);
  };
  useEffect(() => {
    window.addEventListener("resize", resizeHandeler);

    return () => window.removeEventListener("resize", resizeHandeler);
  }, []);

  useEffect(() => {
    const getAllQuestion = async () => {
      const response = await getQuestions(user_id, exam_id);
      setExam(response?.data);
    };
    getAllQuestion();
  }, []);

  const handleAnswerChange = (questionId, value, type) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        answer: value, // Store the selected answer
        type: type, // Store the question type
      },
    }));
  };

  const handleNext = () => {
    if (currentIndex < exam?.questions?.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Request full-screen mode
  const enterFullScreen = () => {
    const doc = document.documentElement;
    if (doc.requestFullscreen) {
      doc.requestFullscreen();
    } else if (doc.webkitRequestFullscreen) {
      // Safari
      doc.webkitRequestFullscreen();
    } else if (doc.mozRequestFullScreen) {
      // Firefox
      doc.mozRequestFullScreen();
    } else if (doc.msRequestFullscreen) {
      // IE/Edge
      doc.msRequestFullscreen();
    }
    setIsFullScreen(true);
  };

  // Exit full-screen mode
  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
    setIsFullScreen(false);
  };

  const config = {
    setTextModal,
    setFeedBackModal,
    setNext,
    next,
    setIsModalVisible,
    exam,
    currentIndex,
    suspendModal,
    setSuspentModal,
    endExameModal,
    setEndExamModal,
    selectedAnswers,
    setSelectedAnswers,
    enterFullScreen,
    exitFullScreen,
    isFullScreen,
  };

  const renderQuestion = (question) => {
    if (!question) return null;

    const { id, type } = question;

    const commonProps = {
      question,
      selectedValue: responses[id]?.answer || null,
      onChange: (value) => handleAnswerChange(id, value, type), // Pass type here
    };

    switch (type) {
      case "multiple_choice":
        return <MultipleChoiceQuestion {...commonProps} config={config} />;
      case "matrix_multiple_choice":
        return (
          <MatrixMultipleChoiceQuestion {...commonProps} config={config} />
        );
      case "multiple_response_select":
        return (
          <MultipleResponseSelectQuestion {...commonProps} config={config} />
        );
      case "multiple_response_select_apply":
        return (
          <MultipleResponseSelectApplyQuestion
            {...commonProps}
            config={config}
          />
        );
      default:
        return null;
    }
  };

  const handleNoteChange = () => {};

  const handleClose = (type) => {
    if (type === "note") {
      setTextModal(false);
    } else {
      setFeedBackModal(false);
    }
  };

  const handelSubmit = (type) => {
    if (type === "note") {
      message.success("Submited");
      setTextModal(false);
    } else {
      message.success("Submited");
      setFeedBackModal(false);
    }
  };

  const currentQuestion = exam?.questions[currentIndex];

  const onFinsh = async () => {
    const transformAnswers = (responses) => {
      return Object.keys(responses)
        .map((key) => {
          const { answer, type } = responses[key];
          let formattedAnswer;

          if (Array.isArray(answer)) {
            formattedAnswer = answer
              .map((a) =>
                typeof a === "object"
                  ? { question: a.question, option: a.option }
                  : a
              )
              .filter((a) => a !== null && a !== undefined && a !== ""); // Filter invalid answers
          } else {
            formattedAnswer = answer;
          }

          return {
            question_id: key,
            selected_answer: formattedAnswer,
            question_type: type,
          };
        })
        .filter(
          (item) =>
            item.selected_answer !== null &&
            item.selected_answer !== undefined &&
            item.selected_answer !== "" // Filter invalid entries
        );
    };

    const postData = transformAnswers(responses);

    console.log("ON FINSH", postData);

    try {
      const response = await axios.post(
        `https://co-tutorlearning.com/api/Nclex_exam/submit_exam_answers`,
        { user_id, exam_id, answers: postData }
      );
      if (response?.data?.status) {
        message.success(response?.data?.message);
        navigate("/result");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  // console.log("ITTTTTTT", currentQuestion);

  const sanitizedHtml = DOMPurify.sanitize(currentQuestion?.explanation);

  return (
    <>
      <div className="text-white min-h-screen flex flex-col">
        {/* Header Section */}
        <Header config={config} />

        {/* Main Content */}
        <div
          className={`flex  ${
            next ? "flex-col lg:flex-row" : "flex-col"
          } bg-white text-black rounded-lg`}
        >
          {/* Question Section */}
          <div
            className={`${
              next === currentQuestion?.id ? "w-full lg:w-1/2" : "w-full"
            }  p-3 lg:p-6 `}
            style={isMobile ? {} : { maxHeight: "600px", overflowY: "auto" }}
          >
            <div>{renderQuestion(currentQuestion)}</div>
          </div>

          {/* Result Section */}
          {next === currentQuestion?.id && (
            <div
              className="w-full lg:w-1/2 p-6 border-l "
              style={isMobile ? {} : { maxHeight: "600px", overflowY: "auto" }}
            >
              <h2 className="font-bold mb-2">Explanation</h2>
              <p
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                style={{ lineHeight: "30px" }}
              />
            </div>
          )}
        </div>

        {/* Footer Navigation */}

        <div className="flex flex-wrap justify-between items-center p-4 mt-auto bg-[#0067a9] text-white">
          {/* Left Section */}
          <div className="flex justify-start items-center gap-2">
            {isMobile ? (
              <div onClick={() => setEndExamModal(true)}>
                <ReplyAllIcon />
              </div>
            ) : (
              <Button
                onClick={() => setEndExamModal(true)}
                className="bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2"
              >
                <span>
                  <ReplyAllIcon />
                </span>
                End
              </Button>
            )}

            {isMobile ? (
              <div onClick={() => setSuspentModal(true)}>
                <PauseCircleIcon />
              </div>
            ) : (
              <Button
                onClick={() => setSuspentModal(true)}
                className="bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2"
              >
                <span>
                  {" "}
                  <PauseCircleIcon />
                </span>
                Suspend
              </Button>
            )}
          </div>

          {/* Right Section */}
          <div className="flex justify-start items-center gap-2">
            {isMobile ? (
              <div onClick={handlePrevious}>
                <NavigateBeforeIcon />
              </div>
            ) : (
              <Button
                className="bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <span>
                  <NavigateBeforeIcon />
                </span>{" "}
                Previous
              </Button>
            )}

            {/* {!isMobile && (
              <Button
                className="bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2"
                onClick={() => setNext(true)}
                disabled={currentIndex === 0}
              >
                Navigator
              </Button>
            )} */}

            {currentIndex === exam?.questions.length - 1 ? (
              ""
            ) : (
              <>
                <Button
                  className="bg-blue-700 text-white w-full sm:w-auto flex justify-center items-center gap-2"
                  onClick={handleNext}
                  disabled={currentIndex === exam?.questions.length - 1}
                >
                  Next{" "}
                  <span>
                    <NavigateNextIcon />
                  </span>
                </Button>
              </>
            )}

            {currentIndex === exam?.questions.length - 1 && (
              <div className="w-full sm:w-auto">
                <Button
                  className="bg-blue-700 text-white w-full sm:w-auto flex items-center gap-2"
                  onClick={() => onFinsh()}
                >
                  <CheckCircleIcon /> Submit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal/Dialog */}
      {textModal && (
        <ModalCompo
          state={textModal}
          handleClose={handleClose}
          type={"note"}
          heading={"Note"}
          handelSubmit={handelSubmit}
        />
      )}
      {/* Feedback/Dialog */}
      {FeedbackModal && (
        <ModalCompo
          state={FeedbackModal}
          handleClose={handleClose}
          type={"feedback"}
          heading={"Feedback"}
          handelSubmit={handelSubmit}
        />
      )}

      <CalculatorModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />

      <SuspendPopup config={config} />
      <EndExamModal config={config} />
    </>
  );
};

export default NursingTestUI;
