import React, { useState, useEffect } from "react";
import { Checkbox, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const MultipleResponseSelectApplyQuestion = ({
  question,
  selectedValue,
  onChange,
  config,
}) => {
  // Use state to keep track of selected options
  const [selectedOptions, setSelectedOptions] = useState(selectedValue || []); // Initial value can be passed as a prop
  const { setNext, next } = config;

  const handelChange = (e) => {
    const { value, checked } = e.target;

    // Update the selected options based on whether checkbox is checked or unchecked
    setSelectedOptions((prevSelectedOptions) => {
      const updatedOptions = checked
        ? [...prevSelectedOptions, value] // Add value if checked
        : prevSelectedOptions.filter((item) => item !== value); // Remove value if unchecked
      // Trigger the onChange callback with the updated selected options
      onChange(updatedOptions); // This will be called every time a checkbox is clicked
      return updatedOptions;
    });
  };

  // Monitoring state changes using useEffect
  useEffect(() => {
    console.log("Current selected options:", selectedOptions);
  }, [selectedOptions]); // This will run every time selectedOptions changes

  const removePTags = (text) => {
    return text.replace(/<\/?p>/g, ""); // Remove <p> and </p> tags
  };

  return (
    <div>
      <div>
        {/* Question Section */}
        <div className="mb-5">
          <p>{question?.question}</p>
        </div>
        {next === question?.id ? (
          <>
            {/* Options Section */}
            <div>
              <ul className="ml-0 lg:ml-6 mb-5">
                {question?.options?.map((option) => (
                  <li
                    key={option}
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

                    <Checkbox
                      checked={option?.is_correct === "1" && true} // Track whether the checkbox is checked
                    >
                      {removePTags(option?.option_text)}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Options Section */}
            <div>
              <ul className="ml-0 lg:ml-6 mb-5">
                {question?.options?.map((option) => (
                  <li key={option} className="mb-3">
                    <Checkbox
                      value={option?.id}
                      checked={selectedOptions.includes(option?.id)} // Track whether the checkbox is checked
                      onChange={handelChange} // Update selectedOptions on change
                    >
                      {removePTags(option?.option_text)}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigation Buttons (optional, if you want to keep them) */}
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
    </div>
  );
};

export default MultipleResponseSelectApplyQuestion;
