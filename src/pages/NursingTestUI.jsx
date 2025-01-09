import React, { useEffect, useRef, useState } from "react";
import { Button, message, Radio } from "antd";
import MultipleChoiceQuestion from "../components/exam/MultipleChoiceQuestion";
import MatrixMultipleChoiceQuestion from "../components/exam/MatrixMultipleChoiceQuestion";
import MultipleResponseSelectQuestion from "../components/exam/MultipleResponseSelectQuestion";
import MultipleResponseSelectApplyQuestion from "../components/exam/MultipleResponseSelectApplyQuestion";
import { examData } from "../service/exams";
import { getQuestions, submitEachAnswer } from "../api";
import Header from "../components/header/Header";
import { Modal, Input } from "antd";
import ModalCompo from "../components/Modal/ModalCompo";
import DOMPurify from "dompurify";
import axios from "axios";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { json, useNavigate } from "react-router-dom";
import CalculatorModal from "../components/CalculatorModal/CalculatorModal";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import SuspendPopup from "../components/PopupsEnd/SuspendPopup";
import EndExamModal from "../components/PopupsEnd/EndExamModal";
import TimeOut from "../components/PopupsEnd/TimeOut";
import { useAppContext } from "../context";

const NursingTestUI = ({ userId, examId }) => {
  const [next, setNext] = useState(null);
  const { setGlobelSelecte, globelSelecte } = useAppContext();

  const [currentIndex, setCurrentIndex] = useState(
    localStorage.getItem("currentIndex") || 0
  ); // Track the current question index
  const [responses, setResponses] = useState({}); // Store user responses
  const [exams, setExam] = useState({});
  const { exam } = exams;

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [textModal, setTextModal] = useState(false);
  const [FeedbackModal, setFeedBackModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [suspendModal, setSuspentModal] = useState(false);
  const [endExameModal, setEndExamModal] = useState(false);
  const [timeIsUpModal, setTimeIsUpModal] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({
    "Statement 1": "",
    "Statement 2": "",
    "Statement 3": "",
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 800);
  const [pressNextButton, setPressButton] = useState(false);

  const objRef = useRef();

  const navigate = useNavigate();

  let user_id = JSON.parse(userId);
  let exam_id = JSON.parse(examId);

  const resizeHandeler = () => {
    setIsMobile(window.innerWidth <= 800);
  };
  useEffect(() => {
    window.addEventListener("resize", resizeHandeler);

    return () => window.removeEventListener("resize", resizeHandeler);
  }, []);

  const getAllQuestion = async () => {
    const response = await getQuestions(user_id, exam_id);
    setExam(response?.data);
  };
  useEffect(() => {
    getAllQuestion();
  }, []);

  useEffect(() => {
    const itemNumber = localStorage.getItem("currentIndex");
    if (itemNumber !== null) {
      setCurrentIndex(parseInt(itemNumber, 10)); // Safely parse to number
    }
  }, []);

  // time calculation start

  const [timeLeft, setTimeLeft] = useState(0); // Time left
  const [timerRunning, setTimerRunning] = useState(false); // Timer state
  const [initialTime, setInitialTime] = useState(0); // Store the initial time in seconds

  useEffect(() => {
    // Check if exam.is_timed is "1" (string) and total_time exists
    if (exam?.is_timed === "1" && exam?.total_time) {
      const [minutes, seconds] = exam?.total_time.split(":").map(Number);
      const totalSeconds = minutes * 60 + (seconds || 0); // Convert to seconds
      setTimeLeft(totalSeconds); // Set time left initially
      setInitialTime(totalSeconds); // Store the initial time in seconds
      setTimerRunning(true); // Start the timer immediately
    }
  }, [exam?.is_timed, exam?.total_time]);

  useEffect(() => {
    let timer;

    if (timerRunning) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); // Decrement time when counting down
      }, 1000);
    }

    if (timeLeft === 0 && timerRunning && exam?.is_timed === "1") {
      setTimerRunning(false); // Stop the timer when time reaches 0
      console.log("Time is up!"); // Log when time is up
      // You can show a modal or other actions here
      if (exam?.is_timed === "1") {
        setTimeIsUpModal(true);
      }
    }

    return () => clearInterval(timer); // Cleanup interval when component unmounts or dependencies change
  }, [timerRunning, timeLeft]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600); // Calculate hours
    const minutes = Math.floor((timeInSeconds % 3600) / 60); // Calculate minutes
    const seconds = timeInSeconds % 60; // Calculate seconds

    return `${hours > 0 ? `${hours < 10 ? "0" : ""}${hours}:` : ""}${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleButtonClick = () => {
    setTimerRunning(false); // Stop the timer
    // console.log(`Timer stopped at: ${formatTime(timeLeft)}`);
  };

  const handleReset = () => {
    setTimeLeft(initialTime); // Reset timeLeft to the initial time value
    setTimerRunning(true); // Restart the timer
    // console.log("Timer reset.");
  };

  const stopTimer = () => {
    setTimerRunning(false); // Stop the timer
    // console.log("Timer stopped at:", formatTime(timeLeft));
  };

  const handleStartTimer = () => {
    setTimerRunning(true); // Restart the timer
    // console.log("Timer restarted at:", formatTime(timeLeft));
  };

  // time calculation end

  // not timed
  const [elapsedTime, setElapsedTime] = useState(0); // Time spent on the current question
  const [isTimerActive, setIsTimerActive] = useState(false); // Timer state
  const [questionStartTimestamp, setQuestionStartTimestamp] = useState(0); // Store the start time of each question

  useEffect(() => {
    // Automatically start the timer when the component mounts
    startQuestionTimer();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    let questionTimerInterval;

    // If timer is active, increment the elapsed time every second
    if (isTimerActive) {
      questionTimerInterval = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1); // Increment elapsed time for each question
      }, 1000);
    }

    return () => clearInterval(questionTimerInterval); // Cleanup interval when timer stops
  }, [isTimerActive]);

  // Format time in 00:00 (minutes:seconds)
  const formatElapsedTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60); // Calculate minutes
    const seconds = timeInSeconds % 60; // Calculate seconds
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`; // Format as 00:00
  };

  const startQuestionTimer = () => {
    setIsTimerActive(true); // Start the timer for the question
    setQuestionStartTimestamp(Date.now()); // Track start timestamp for the question
    // console.log("Question timer started.");
  };

  const stopQuestionTimer = () => {
    setIsTimerActive(false); // Stop the timer for the question
    // console.log(`Question timer stopped at: ${formatElapsedTime(elapsedTime)}`);
  };

  const resetQuestionTimer = () => {
    setElapsedTime(0); // Reset elapsed time
    setIsTimerActive(true); // Restart the timer
    // console.log("Question timer reset.");
  };

  // Track the time spent on the current question
  const submitQuestion = () => {
    // console.log(
    //   `Time spent on this question: ${formatElapsedTime(elapsedTime)}`
    // );
    // You can send the time spent on this question to the API
  };

  const handleAnswerChange = (questionId, value, type) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: {
        answer: value, // Store the selected answer
        type: type, // Store the question type
      },
    }));
  };

  const handelNextFunction = async (dataitem) => {
    try {
      const response = await submitEachAnswer(dataitem);
      if (response?.data?.status) {
        setPressButton(false);
        stopTimer();
        getAllQuestion();

        // console.log("response ayitund", response);

        return response; // Return the response after success
      }
      return null; // Return null if the response is not successful
    } catch (error) {
      console.log(error);
      return null; // Handle error and return null
    }
  };

  const currentQuestion = exam?.questions[currentIndex];

  const handleNext = async (data, key) => {
    const currentQuestion = exam?.questions[currentIndex];
    const answerData = responses;

    let slectedItem = responses[exam?.questions[currentIndex]?.id]?.answer;

    const timeDifference = initialTime - timeLeft;
    const dataitem = {
      user_id: user_id,
      exam_id: exam_id,
      question_id: currentQuestion?.id,
      selected_answer: slectedItem === null ? [] : slectedItem, // Could be an array for multiple responses
      question_type: currentQuestion?.type,
      time_taken:
        exam?.is_timed === "1"
          ? formatTime(timeDifference)
          : formatTime(timeLeft),
    };

    if (dataitem?.selected_answer !== undefined) {
      console.log("next data", dataitem);

      // Here api call check
    }

    if (currentIndex < exam?.questions?.length - 1) {
      const nextIndex = currentIndex + 1; // Calculate the next index
      setCurrentIndex(nextIndex);

      // Save the updated index to localStorage
      localStorage.setItem("currentIndex", nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const nextIndex = currentIndex - 1; // Calculate the next index
      setCurrentIndex(nextIndex);
      localStorage.setItem("currentIndex", nextIndex);
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
    getAllQuestion,
    user_id,
    exam_id,

    // time
    timeLeft,
    initialTime,
    timerRunning,
    formatTime,
    handleButtonClick,
    handleReset,
    timeIsUpModal,
    setTimeIsUpModal,
    stopTimer,
    handleStartTimer,
    handleNext,
    handleNext,
    pressNextButton,
    setPressButton,
    objRef,

    // not timed
    notTime: formatElapsedTime(elapsedTime),
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
        localStorage.removeItem("currentIndex");
        // navigate("/result");
        window.location.replace(
          `https://co-tutorlearning.com/app/result/get_exam_result_get/?user_id=${user_id}&exam_id=${exam_id}`
        );
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  // console.log("ITTTTTTT", currentQuestion);

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
        return (
          <MultipleChoiceQuestion
            {...commonProps}
            config={config}
            handelNextFunction={handelNextFunction}
          />
        );

      case "multiple_response_select":
        return (
          <MultipleResponseSelectQuestion
            {...commonProps}
            config={config}
            handelNextFunction={handelNextFunction}
          />
        );
      case "multiple_response_select_apply":
        return (
          <MultipleResponseSelectApplyQuestion
            {...commonProps}
            config={config}
            handelNextFunction={handelNextFunction}
          />
        );
      // case "matrix_multiple_choice":
      //   return (
      //     <MatrixMultipleChoiceQuestion {...commonProps} config={config} />
      //   );
      default:
        return null;
    }
  };

  const sanitizedHtml = DOMPurify.sanitize(currentQuestion?.explanation);

  return (
    <>
      <div className="text-white min-h-screen flex flex-col">
        {/* Header Section */}
        <Header config={config} currentQuestion={currentQuestion} />

        {/* Main Content */}
        <div
          className={`flex  ${
            currentQuestion?.is_attended === 1
              ? "flex-col lg:flex-row"
              : "flex-col"
          }  text-black rounded-lg`}
        >
          {/* Question Section */}
          <div
            className={`${
              currentQuestion?.is_attended === 1 ? "w-full lg:w-1/2" : "w-full"
            }  p-3 pr-0  ${
              currentQuestion?.is_attended === 1 ? "" : "lg:pr-60"
            } lg:p-6   `}
            style={
              isMobile
                ? {}
                : { maxHeight: "calc(100vh - 160px)", overflowY: "auto" }
            }
          >
            <div>{renderQuestion(currentQuestion)}</div>
          </div>

          {/* Result Section */}
          {currentQuestion?.is_attended === 1 && (
            <div
              className="w-full lg:w-1/2 p-6 border-l "
              style={
                isMobile
                  ? {}
                  : { maxHeight: "calc(100vh - 160px)", overflowY: "auto" }
              }
            >
              <h2 className="font-bold mb-2">Explanation</h2>

              {currentQuestion?.explanation_image.trim() !== "" && (
                <div className="mt-3 mb-3">
                  <img
                    src={currentQuestion?.explanation_image}
                    className="w-64 md:w-96"
                    alt=""
                  />
                </div>
              )}
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
      <EndExamModal config={config} onFinsh={onFinsh} />
      <TimeOut config={config} onFinsh={onFinsh} />
    </>
  );
};

export default NursingTestUI;
