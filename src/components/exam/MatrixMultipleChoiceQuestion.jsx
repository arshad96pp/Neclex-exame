import React, { useState } from "react";
import { Table, Radio, Button } from "antd";

const MatrixMultipleChoiceQuestion = ({
  question,
  selectedValue,
  onChange,
  config,
}) => {
  const { setNext, selectedAnswers, setSelectedAnswers } = config;

  const [tabClick, setTabClick] = useState(null);

  // Handle selection change for each statement
  const handleSelectionChange = (statement, value, choiceId) => {
    const updatedAnswers = {
      ...selectedAnswers,
      [statement]: { value, choiceId }, // Store the selected value and the id of the choice
    };
    setSelectedAnswers(updatedAnswers); // Update the local state

    // Extract choice IDs into an array
    const selectedIds = Object.values(updatedAnswers)
      .filter((answer) => answer.choiceId) // Ensure valid answers
      .map((answer) => answer.choiceId);

    onChange(selectedIds); // Notify the parent component with the updated IDs array
    console.log("Selected choice IDs:", selectedIds); // Log the updated array
  };

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
      <div className="flex justify-start items-center gap-3 mb-3">
        {question?.question_parts?.map((item, index) => (
          <Button key={index} onClick={() => handelTabClick(item?.id)}>
            {item?.title}
          </Button>
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

      <h1 className="mb-5">{question?.question}</h1>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        rowKey="key"
      />

      <div className=" mb-4 mt-5">
        <Button
          style={{ background: "blue", color: "white" }}
          onClick={() => setNext(question?.id)}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MatrixMultipleChoiceQuestion;
