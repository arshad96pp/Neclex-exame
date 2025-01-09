import React, { useEffect, useState } from "react";
import { Radio, Button } from "antd";
import DOMPurify from "dompurify";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import BookmarkAddedRoundedIcon from "@mui/icons-material/BookmarkAddedRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import { submitEachAnswer } from "../../api";
import { useAppContext } from "../../context";

const MultipleChoiceQuestion = ({
  question,
  selectedValue,
  onChange,
  config,
  handelNextFunction,
}) => {
  const {
    setNext,
    next,
    getAllQuestion,
    user_id,
    exam_id,
    exam,
    timeLeft,
    initialTime,
    handleButtonClick,
    formatTime,
    handleReset,
    stopTimer,
    handleStartTimer,
    currentIndex,
    handleNext,
    pressNextButton,
    setPressButton,
    objRef,
  } = config;

  const [slected, setSelected] = useState(null);
  const { setGlobelSelecte } = useAppContext();

  // Function to sanitize and remove <p> tags
  const cleanOptionText = (text) => {
    // Use DOMPurify to remove <p> tags and any other unwanted HTML
    const sanitized = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // Empty array to remove all tags
    });
    return sanitized;
  };


  

  const handelReviewClick = async () => {
    const timeDifference = initialTime - timeLeft;

    handleButtonClick();
    setNext(question?.id);
    const dataitem = {
      user_id: user_id,
      exam_id: exam_id,
      question_id: question?.id,
      selected_answer: selectedValue === null ? [] : selectedValue, // Could be an array for multiple responses
      question_type: question?.type,
      time_taken:
        exam?.is_timed === "1"
          ? formatTime(timeDifference)
          : formatTime(timeLeft),
    };

    objRef.current = dataitem;

    try {
      const response = await handelNextFunction(dataitem);
      if (response?.data?.status) {
        // stopTimer();
        // getAllQuestion();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (question?.is_attended !== 1) {
      handleStartTimer();
    } else {
      stopTimer();
    }
  }, [question?.is_attended]);

  return (
    <div>
      {exam?.is_tutored === "1" && question?.is_attended === 1 ? (
        <>
          <div className="mb-5 text-[16px]">
            {cleanOptionText(question?.question)}
          </div>
          {question?.question_image?.trim() !== "" && (
            <>
              <div>
                <img
                  className="w-64 md:w-96"
                  src={question?.question_image}
                  alt=""
                />
              </div>
            </>
          )}

          <div className="pl-0 lg:p-5 mb-4">
            <Radio.Group
              value={question?.selected_answer?.[0]} // Track the first selected answer (if there are multiple, we'll handle them)
              onChange={(e) => {
                // Logic to handle the Radio button changes if needed
              }}
            >
              {question?.options?.map((item, index) => (
                <div key={index} className="flex items-center mb-4">
                  {/* Correct Answer Icon */}
                  <div className="flex items-center ">
                    {/* Icon for correct/incorrect answer */}
                    <div className="flex items-center">
                      {item?.is_correct === "1" ? (
                        <CheckCircleOutlined
                          className="text-green-500"
                          style={{ fontSize: "18px" }}
                        />
                      ) : question?.selected_answer?.includes(item?.id) &&
                        item?.is_correct !== "1" ? (
                        <CloseCircleOutlined
                          className="text-red-600"
                          style={{ fontSize: "18px" }}
                        />
                      ) : (
                        <div style={{ width: "18px" }} /> // Placeholder to maintain alignment
                      )}
                    </div>

                    {/* Radio button */}
                    <Radio value={item?.id} className="flex items-center ml-2">
                      <p className="text-[16px]">
                        {cleanOptionText(item?.option_text)}
                      </p>
                    </Radio>
                  </div>
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="max-w-[90%] m-auto h-20 bg-[#f3f3f354]  grid grid-cols-[1fr_1fr] shadow-[0px_4px_6px_rgba(0,0,0,0.1)]">
            <div className="p-2 grid place-items-center">
              <div>
                <div className="flex justify-center items-center gap-2">
                  <span>
                    <BookmarkAddedRoundedIcon />
                  </span>
                  <div>
                    <p className="text-xs">0/9</p>
                    <p className="text-xs">Scored max</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="p-2 grid place-items-center">
              <div>
                <div className="flex justify-center items-center gap-2">
                  <span>
                    <CreateRoundedIcon />
                  </span>
                  <div>
                    <p className="text-xs">0/9 Scoring</p>
                    <p className="text-xs">Scoring Rule</p>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="p-2 grid place-items-center">
              <div>
                <div className="flex justify-center items-center gap-2">
                  <span>
                    <WatchLaterRoundedIcon />
                  </span>
                  <div>
                    <p className="text-xs">{question?.time_taken}</p>
                    <p className="text-xs">Time Spend</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mb-5 text-[16px]">
            {cleanOptionText(question?.question)}
          </div>

          {question?.question_image?.trim() !== "" && (
            <>
              <div>
                <img className="w-80" src={question?.question_image} alt="" />
              </div>
            </>
          )}

          <div className="pl-0 lg:p-5 mb-1">
            <Radio.Group
              onChange={(e) => {
                onChange(e.target.value);
                setSelected(e.target.value);
              }}
              value={selectedValue}
            >
              {question?.options?.map((item, index) => (
                <Radio
                  key={index}
                  value={item?.id}
                  className="flex items-center mb-4" // Flexbox to align items
                >
                  <p className="text-[16px] ml-2 ">
                    {cleanOptionText(item?.option_text)}
                  </p>
                  {/* Add a margin to separate text from radio */}
                </Radio>
              ))}
            </Radio.Group>
          </div>

          {exam?.is_tutored === "1" && (
            <div className="pl-0 lg:p-5 mb-4">
              <Button
                style={{ background: "blue", color: "white" }}
                onClick={() => handelReviewClick()}
              >
                Submit
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
