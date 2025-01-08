import React, { useEffect, useState } from "react";
import { Table, Radio, Button } from "antd";
import { submitEachAnswer } from "../../api";
import BookmarkAddedRoundedIcon from "@mui/icons-material/BookmarkAddedRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import WatchLaterRoundedIcon from "@mui/icons-material/WatchLaterRounded";

const MatrixMultipleChoiceQuestion = ({
  question,
  selectedValue,
  onChange,
  config,
}) => {
  const {
    next,
    setNext,
    selectedAnswers,
    setSelectedAnswers,
    updateReviewList,
    user_id,
    exam_id,
    exam,
    getAllQuestion,
    timeLeft,
    initialTime,
    handleButtonClick: handeltimeStop,
    formatTime,
  } = config;

  const [tabClick, setTabClick] = useState(null);

  // Function to auto-select the correct answers
  const autoSelectCorrectAnswers = () => {
    if (question?.options?.length > 0) {
      const prefilledAnswers = {};
      question.options.forEach((option) => {
        const correctChoice = option.choices.find(
          (choice) => choice.header === option.answer
        );
        if (correctChoice) {
          prefilledAnswers[option.question] = {
            value: correctChoice.header,
            choiceId: correctChoice.id,
          };
        }
      });
      setSelectedAnswers(prefilledAnswers);
    }
  };

  // Handle button click to auto-select correct answers
  const handleButtonClick = async () => {
    // autoSelectCorrectAnswers(); // Auto-select correct answers
    setNext(question?.id); // Trigger next question logic
    localStorage.setItem("examReview", question?.id);

    const timeDifference = initialTime - timeLeft;
    handeltimeStop();
    const dataitem = {
      user_id: user_id,
      exam_id: exam_id,
      question_id: question?.id,
      selected_answer: selectedValue === null ? [] : selectedValue, // Could be an array for multiple responses
      question_type: question?.type,
      time_taken: formatTime(timeDifference),
    };

    try {
      const response = await submitEachAnswer(dataitem);

      if (response?.status) {
        getAllQuestion();
        console.log("responseee", response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle selection change for each statement
  const handleSelectionChange = (statement, value, choiceId) => {
    const updatedAnswers = {
      ...selectedAnswers,
      [statement]: { value, choiceId },
    };
    setSelectedAnswers(updatedAnswers);

    // Extract choice IDs into an array
    const selectedIds = Object.values(updatedAnswers)
      .filter((answer) => answer.choiceId) // Ensure valid answers
      .map((answer) => answer.choiceId);

    onChange(selectedIds); // Notify the parent component with the updated IDs array
  };

  // Set initial tabClick value when question data is available
  useEffect(() => {
    if (question?.question_parts?.length > 0) {
      setTabClick(question.question_parts[0].id); // Automatically click the first tab
    }
  }, [question]);

  useEffect(() => {
    if (question?.is_attended === 1) {
      autoSelectCorrectAnswers();
    }
  }, [question]);

  // Columns definition for the Ant Design Table
  const columns = [
    {
      title: "Statement",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "True",
      key: "true",
      render: (_, record) =>
        record.choices.map(
          (choice) =>
            choice.header === "True" && (
              <Radio
                value={choice.header}
                checked={
                  selectedAnswers[record.question]?.value === choice.header
                }
                onChange={() =>
                  handleSelectionChange(
                    record.question,
                    choice.header,
                    choice.id
                  )
                }
              />
            )
        ),
    },
    {
      title: "False",
      key: "false",
      render: (_, record) =>
        record.choices.map(
          (choice) =>
            choice.header === "False" && (
              <Radio
                value={choice.header}
                checked={
                  selectedAnswers[record.question]?.value === choice.header
                }
                onChange={() =>
                  handleSelectionChange(
                    record.question,
                    choice.header,
                    choice.id
                  )
                }
              />
            )
        ),
    },
    {
      title: "Moderate",
      key: "moderate",
      render: (_, record) =>
        record.choices.map(
          (choice) =>
            choice.header === "Moderate" && (
              <Radio
                value={choice.header}
                checked={
                  selectedAnswers[record.question]?.value === choice.header
                }
                onChange={() =>
                  handleSelectionChange(
                    record.question,
                    choice.header,
                    choice.id
                  )
                }
              />
            )
        ),
    },
  ];

  const columnsSame = [
    {
      title: "Statement",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "True",
      key: "true",
      render: (_, record) =>
        record.choices.map(
          (choice) =>
            choice.header === "True" && (
              <Radio
                value={choice.header}
                checked={
                  selectedAnswers[record.question]?.value === choice.header
                }
                className={
                  selectedAnswers[record.question]?.value === choice.header
                    ? "radio-checked-green"
                    : ""
                }
              />
            )
        ),
    },
    {
      title: "False",
      key: "false",
      render: (_, record) =>
        record.choices.map(
          (choice) =>
            choice.header === "False" && (
              <Radio
                value={choice.header}
                checked={
                  selectedAnswers[record.question]?.value === choice.header
                }
                className={
                  selectedAnswers[record.question]?.value === choice.header
                    ? "radio-checked-green"
                    : ""
                }
              />
            )
        ),
    },
    {
      title: "Moderate",
      key: "moderate",
      render: (_, record) =>
        record.choices.map(
          (choice) =>
            choice.header === "Moderate" && (
              <Radio
                value={choice.header}
                checked={
                  selectedAnswers[record.question]?.value === choice.header
                }
                className={
                  selectedAnswers[record.question]?.value === choice.header
                    ? "radio-checked-green"
                    : ""
                }
              />
            )
        ),
    },
  ];

  // Data preparation for the table
  const data = question?.options.map((option, index) => ({
    key: index,
    question: option.question,
    choices: option.choices,
  }));

  const handelTabClick = (id) => {
    setTabClick(id);
  };

  return (
    <div>
      <h1 className="mb-5 text-[16px]">{question?.question}</h1>

      {question?.question_parts?.length !== 0 && (
        <>
          <div className="flex justify-start items-center gap-3 mb-3">
            {question?.question_parts?.map((item, index) => (
              <div
                key={index}
                className={`cursor-pointer px-4 py-2 rounded ${
                  tabClick === item?.id
                    ? "bg-gray-200 text-black"
                    : "bg-white text-black"
                }`}
                onClick={() => handelTabClick(item?.id)}
              >
                {item?.title}
              </div>
            ))}
          </div>

          {/* Render the content of the selected tab */}
          <div className="mb-3">
            {question?.question_parts?.map(
              (item) =>
                tabClick === item?.id && (
                  <div
                    key={item?.id}
                    dangerouslySetInnerHTML={{ __html: item?.content }}
                  />
                )
            )}
          </div>

          <div className="max-w-[90%] m-auto mt-9 h-20 bg-[#f3f3f354]  grid grid-cols-[1fr_1fr] shadow-[0px_4px_6px_rgba(0,0,0,0.1)]">
            <div className="p-2 grid place-items-center">
              <div>
                <div className="flex justify-center items-center gap-2">
                  <span>
                    <BookmarkAddedRoundedIcon />
                  </span>
                  <div>
                  <p className="text-xs">{question?.time_taken}</p>
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
                    <p className="text-xs">02 secs</p>
                    <p className="text-xs">Time Spend</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {question?.final_part?.trim() !== "" && (
        <div className="mb-3 max">
          <p> {question?.final_part}</p>
        </div>
      )}

      {exam?.is_tutored === "1" && question?.is_attended === 1 ? (
        <>
          <Table
            columns={columnsSame}
            dataSource={data}
            pagination={false}
            bordered
            rowKey="key"
          />
        </>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            rowKey="key"
          />

          {exam?.is_tutored === "1" && (
            <div className=" mb-4 mt-5">
              <Button
                style={{ background: "blue", color: "white" }}
                onClick={handleButtonClick} // Call auto-select on button click
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

export default MatrixMultipleChoiceQuestion;
