// import React, { useEffect, useState } from "react";
// import { Table, Radio, Button } from "antd";

// const MatrixMultipleChoiceQuestion = ({
//   question,
//   selectedValue,
//   onChange,
//   config,
// }) => {
//   const { setNext, selectedAnswers, setSelectedAnswers } = config;

//   const [tabClick, setTabClick] = useState(null);

//   const autoSelectCorrectAnswers = () => {
//     if (question?.options?.length > 0) {
//       const prefilledAnswers = {};
//       question.options.forEach((option) => {
//         const correctChoice = option.choices.find(
//           (choice) => choice.header === option.answer
//         );
//         if (correctChoice) {
//           prefilledAnswers[option.question] = {
//             value: correctChoice.header,
//             choiceId: correctChoice.id,
//           };
//         }
//       });
//       setSelectedAnswers(prefilledAnswers);
//     }
//   };

//   // Handle selection change for each statement
//   const handleSelectionChange = (statement, value, choiceId) => {
//     const updatedAnswers = {
//       ...selectedAnswers,
//       [statement]: { value, choiceId }, // Store the selected value and the id of the choice
//     };
//     setSelectedAnswers(updatedAnswers); // Update the local state

//     // Extract choice IDs into an array
//     const selectedIds = Object.values(updatedAnswers)
//       .filter((answer) => answer.choiceId) // Ensure valid answers
//       .map((answer) => answer.choiceId);

//     onChange(selectedIds); // Notify the parent component with the updated IDs array
//     console.log("Selected choice IDs:", selectedIds); // Log the updated array
//   };

//   // Set initial tabClick value when question data is available
//   useEffect(() => {
//     if (question?.question_parts?.length > 0) {
//       setTabClick(question.question_parts[0].id); // Automatically click the first tab
//     }
//   }, [question]);
//   // Columns definition for the Ant Design Table
//   const columns = [
//     {
//       title: "Statement",
//       dataIndex: "question",
//       key: "question",
//     },
//     {
//       title: "True",
//       key: "true",
//       render: (_, record) =>
//         record.choices.map(
//           (choice) =>
//             choice.header === "True" && (
//               <Radio
//                 value={choice.header}
//                 checked={
//                   selectedAnswers[record.question]?.value === choice.header
//                 }
//                 onChange={() =>
//                   handleSelectionChange(
//                     record.question,
//                     choice.header,
//                     choice.id
//                   )
//                 }
//               />
//             )
//         ),
//     },
//     {
//       title: "False",
//       key: "false",
//       render: (_, record) =>
//         record.choices.map(
//           (choice) =>
//             choice.header === "False" && (
//               <Radio
//                 value={choice.header}
//                 checked={
//                   selectedAnswers[record.question]?.value === choice.header
//                 }
//                 onChange={() =>
//                   handleSelectionChange(
//                     record.question,
//                     choice.header,
//                     choice.id
//                   )
//                 }
//               />
//             )
//         ),
//     },
//     {
//       title: "Moderate",
//       key: "moderate",
//       render: (_, record) =>
//         record.choices.map(
//           (choice) =>
//             choice.header === "Moderate" && (
//               <Radio
//                 value={choice.header}
//                 checked={
//                   selectedAnswers[record.question]?.value === choice.header
//                 }
//                 onChange={() =>
//                   handleSelectionChange(
//                     record.question,
//                     choice.header,
//                     choice.id
//                   )
//                 }
//               />
//             )
//         ),
//     },
//   ];

//   // Data preparation for the table
//   const data = question?.options.map((option, index) => ({
//     key: index,
//     question: option.question,
//     choices: option.choices,
//   }));

//   const handelTabClick = (id) => {
//     autoSelectCorrectAnswers()
//     setTabClick(id);
//   };

//   return (
//     <div>
//       <h1 className="mb-5">{question?.question}</h1>

//       <div className="flex justify-start items-center gap-3 mb-3">
//         {question?.question_parts?.map((item, index) => (
//           <Button key={index} onClick={() => handelTabClick(item?.id)}>
//             {item?.title}
//           </Button>
//         ))}
//       </div>

//       {/* Render the content of the selected tab */}
//       <div className="mb-3">
//         {question?.question_parts?.map(
//           (item) =>
//             tabClick === item?.id && (
//               <div
//                 key={item?.id}
//                 dangerouslySetInnerHTML={{ __html: item?.content }}
//               />
//             )
//         )}
//       </div>

//       {question?.final_part?.trim() !== "" && (
//         <div className="mb-3 max">
//           <p> {question?.final_part}</p>
//         </div>
//       )}

//       <Table
//         columns={columns}
//         dataSource={data}
//         pagination={false}
//         bordered
//         rowKey="key"
//       />

//       <div className=" mb-4 mt-5">
//         <Button
//           style={{ background: "blue", color: "white" }}
//           onClick={() => setNext(question?.id)}
//         >
//           Submit
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default MatrixMultipleChoiceQuestion;

import React, { useEffect, useState } from "react";
import { Table, Radio, Button } from "antd";
import { submitEachAnswer } from "../../api";

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
    getAllQuestion,
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
    const dataitem = {
      user_id: user_id,
      exam_id: exam_id,
      question_id: question?.id,
      selected_answer: selectedValue, // Could be an array for multiple responses
      question_type: question?.type,
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
        </>
      )}

      {question?.final_part?.trim() !== "" && (
        <div className="mb-3 max">
          <p> {question?.final_part}</p>
        </div>
      )}

      {question?.is_attended === 1 ? (
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

          <div className=" mb-4 mt-5">
            <Button
              style={{ background: "blue", color: "white" }}
              onClick={handleButtonClick} // Call auto-select on button click
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MatrixMultipleChoiceQuestion;
