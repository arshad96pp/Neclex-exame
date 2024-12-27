import { Button, Checkbox, message } from "antd";
import React, { useEffect, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";

const MultipleResponseSelectQuestion = ({
  question,
  selectedValue,
  onChange,
  config,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedValue || []); // Initial value can be passed as a prop
  const { setNext, next } = config;

  const handelChange = (e) => {
    const { value, checked } = e.target;

    setSelectedOptions((prevSelectedOptions) => {
      let updatedOptions;

      if (checked) {
        // Prevent selecting more than the allowed options
        if (
          prevSelectedOptions.length >=
          parseInt(question?.option_to_be_selected)
        ) {
          message.error(
            `You can only select up to ${question?.option_to_be_selected} options.`
          );
          return prevSelectedOptions;
        }

        // Add the option if checked
        updatedOptions = [...prevSelectedOptions, value];
      } else {
        // Remove the option if unchecked
        updatedOptions = prevSelectedOptions.filter((item) => item !== value);
      }

      // Trigger onChange with the updated options
      onChange(updatedOptions);

      return updatedOptions;
    });
  };
  // Notify the parent component whenever selectedOptions changes

  console.log("Selected Options:", selectedOptions);

  console.log("QUESTION", question);

  const removePTags = (text) => {
    return text.replace(/<\/?p>/g, ""); // Remove <p> and </p> tags
  };

  return (
    <div>
      <div className="mb-5">
        <p>{question?.question}</p>
      </div>

      {/* Options Section */}

      {next === question?.id ? (
        <>
          <div>
            <ul className="ml-0 lg:ml-6 mb-5">
              {question?.options?.map((option) => (
                <li
                  key={option?.id}
                  className="mb-3 flex justify-start items-center gap-1"
                >
                  {option?.is_correct === "1" ? (
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
                  <Checkbox checked={option?.is_correct === "1" && true}>
                    {removePTags(option?.option_text)}
                  </Checkbox>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div>
            <ul className="ml-0 lg:ml-6 mb-5">
              {question?.options?.map((option) => (
                <li key={option?.id} className="mb-3">
                  <Checkbox
                    value={option?.id}
                    checked={selectedOptions.includes(option?.id)} // Track whether the checkbox is checked
                    onChange={(e) => handelChange(e)} // Update selectedOptions on change
                  >
                    {removePTags(option?.option_text)}
                  </Checkbox>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Buttons */}
          <div className="ml-0 lg:ml-6 mb-5">
            <Button
              style={{ background: "blue", color: "white" }}
              onClick={() => {
                onChange(selectedOptions);
                setNext(question?.id);
              }}
            >
              Submit
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MultipleResponseSelectQuestion;
