import React from "react";
import { Radio, Button } from "antd";
import DOMPurify from "dompurify";
import { CheckCircleOutlined } from "@ant-design/icons";

import BookmarkAddedRoundedIcon from "@mui/icons-material/BookmarkAddedRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";
import { submitEachAnswer } from "../../api";

const MultipleChoiceQuestion = ({
  question,
  selectedValue,
  onChange,
  config,
}) => {
  const { setNext, next, getAllQuestion, user_id, exam_id } = config;

  // Function to sanitize and remove <p> tags
  const cleanOptionText = (text) => {
    // Use DOMPurify to remove <p> tags and any other unwanted HTML
    const sanitized = DOMPurify.sanitize(text, {
      ALLOWED_TAGS: [], // Empty array to remove all tags
    });
    return sanitized;
  };

  const handelReviewClick = async () => {
    console.log("sleted value", selectedValue);

    setNext(question?.id);

    const dataitem = {
      user_id: user_id,
      exam_id: exam_id,
      question_id: question?.id,
      selected_answer: selectedValue, // Could be an array for multiple responses
      question_type: question?.type,
    };

    // Create FormData
    const formData = new FormData();

    // Use Object.entries() to loop through dataitem and append to FormData
    Object.entries(dataitem).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await submitEachAnswer(dataitem);
      if (response?.data?.status) {
        getAllQuestion();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {question?.is_attended === 1 ? (
        <>
          <div className="mb-5 text-[16px]">
            {cleanOptionText(question?.question)}
          </div>
          <div className="pl-0 lg:p-5 mb-4">
            <Radio.Group
              value={
                question?.options?.find((item) => item?.is_correct === "1")?.id
              }
            >
              {question?.options?.map((item, index) => (
                <div key={index} className="flex items-center mb-4">
                  {/* Tick Icon before the radio button */}

                  {item?.is_correct === "1" ? (
                    <CheckCircleOutlined
                      className="text-green-500 mr-2" // Customize the color
                      style={{ fontSize: "18px" }} // Customize the size of the icon
                    />
                  ) : (
                    <CheckCircleOutlined
                      className="text-green-500 mr-2" // Customize the color
                      style={{ fontSize: "18px", opacity: "0" }} // Customize the size of the icon
                    />
                  )}

                  <Radio value={item?.id} className="flex items-center">
                    <p className="text-[16px] ml-2">
                      {cleanOptionText(item?.option_text)}
                    </p>
                  </Radio>
                </div>
              ))}
            </Radio.Group>
          </div>

          {/* <div className="max-w-[90%] m-auto h-20  grid grid-cols-[1fr_1fr_1fr] shadow-[0px_4px_6px_rgba(0,0,0,0.1)]">
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
            <div className="p-2 grid place-items-center">
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
            </div>
            <div className="p-2 grid place-items-center">
              <div>
                <div className="flex justify-center items-center gap-2">
                  <span>
                    <WatchLaterRoundedIcon />
                  </span>
                  <div>
                    <p className="text-xs">02 secs</p>
                    <p className="text-xs">Time Spend</p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </>
      ) : (
        <>
          <div className="mb-5 text-[16px]">
            {cleanOptionText(question?.question)}
          </div>

          <div className="pl-0 lg:p-5 mb-1">
            <Radio.Group
              onChange={(e) => onChange(e.target.value)}
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

          <div className="pl-0 lg:p-5 mb-4">
            <Button
              style={{ background: "blue", color: "white" }}
              onClick={() => handelReviewClick()}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MultipleChoiceQuestion;
