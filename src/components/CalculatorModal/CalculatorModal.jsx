import React, { useState } from "react";
import { Button, Modal, Input } from "antd";
import { evaluate } from "mathjs"; 

const Calculator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  // Handle button click
  const handleClick = (value) => {
    // Handle special cases like sin, cos, etc.
    if (value === "=") {
      try {
        // Using math.js to safely evaluate the expression
        const evaluatedResult = evaluate(expression);
        setResult(evaluatedResult);
      } catch (error) {
        // If there's an error in the expression, show 0
        setResult("0");
      }
    } else if (value === "C") {
      setExpression("");
      setResult("0");
    } else {
      // Avoid adding multiple operators or invalid sequences
      if (
        (["+", "-", "*", "/", "^"].includes(value) && expression === "") ||
        (["+", "-", "*", "/", "^"].includes(expression.slice(-1)) && ["+", "-", "*", "/", "^"].includes(value))
      ) {
        // Don't allow invalid expressions
        return;
      }
      setExpression(expression + value);
      setResult("0"); // Reset the result to 0 when typing
    }
  };

  return (
    <div className="calculator mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Expression Input */}
      <Input
        value={expression}
        placeholder="0"
        className="text-right mb-2 text-xl font-bold bg-gray-100 h-12"
        readOnly
      />
      {/* Result Display */}
      <Input
        value={result}
        placeholder="Result"
        className="text-right mb-4 text-xl font-bold bg-gray-200 h-12"
        readOnly
      />
      {/* Calculator Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {[
          "7", "8", "9", "/", "sqrt",
          "4", "5", "6", "x", "^",
          "1", "2", "3", "-", "(",
          "C", "0", "=", "+", ")",
          "sin", "cos", "tan", "log", "ln"
        ].map((item) => (
          <Button
            key={item}
            onClick={() => handleClick(item)}
            className={`h-11 text-lg font-medium rounded-md ${
              item === "="
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : item === "C"
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-gray-300 hover:bg-gray-200"
            }`}
            block
          >
            {item}
          </Button>
        ))}
      </div>
    </div>
  );
};

const CalculatorModal = ({isModalVisible, setIsModalVisible}) => {

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
   
      <Modal
        title="Calculator"
        width={400}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null} // Remove default footer
      >
        <Calculator />
      </Modal>
    </>
  );
};

export default CalculatorModal;
