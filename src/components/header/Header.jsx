import React, { useEffect, useState } from "react";
import { Button } from "antd";
import AccessAlarmsRoundedIcon from "@mui/icons-material/AccessAlarmsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";

const Header = ({ config, currentQuestion }) => {
  const {
    setTextModal,
    setFeedBackModal,
    exam,
    currentIndex,
    setIsModalVisible,

    enterFullScreen,
    exitFullScreen,
    isFullScreen,

    timeLeft,
    timerRunning,
    formatTime,
    handleButtonClick,
    notTime,
    timeDataObje,
    
  } = config;

   const {currentSeconds,formatMyTimer}=timeDataObje

  return (
    <>
      <div className="flex flex-wrap items-center justify-between p-1 px-4 bg-blue-900 text-white ">
        {/* Left Section */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 text-left">
          <h1 className="text-lg font-bold">NCLEX-RN TEST - TONY ALEX</h1>
        </div>

        {/* Middle Section (Hidden on smaller screens) */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 hidden lg:flex flex-col sm:flex-row gap-3">
          <p className="text-sm">{exam?.title}</p>
          <p className="text-sm">QId: {currentQuestion?.id} </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end w-full sm:w-auto">
          <div>
            <div className="flex justify-start items-center gap-2 mb-1">
              <h4 className="text-sm">Time</h4>
              <span className="text-sm">
                <AccessAlarmsRoundedIcon />
              </span>

              {exam?.is_timed === "1" ? (
                <h4 className="text-sm">{formatTime(timeLeft)}</h4>
              ) : (
                <h4 className="text-sm">{formatMyTimer(currentSeconds)}</h4>
              )}
            </div>

            <div className="flex justify-start items-center gap-2">
              <h4 className="text-sm">Question</h4>
              <span className="text-sm">
                <HelpRoundedIcon />
              </span>
              <h4 className="text-sm">{`${currentIndex + 1} of ${
                exam?.questions?.length
              }`}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons Section */}
      <div className="flex justify-end items-center bg-[#88adff] p-2">
        {/* <div className="flex gap-2">
          <Button
            className="bg-blue-800 text-white w-full sm:w-auto"
            onClick={() => setTextModal(true)}
          >
            Notes
          </Button>
          <Button className="bg-blue-800 text-white w-full sm:w-auto" onClick={()=>setIsModalVisible(true)}>
            Calculator
          </Button>
          <Button
            className="bg-blue-800 text-white w-full sm:w-auto"
            onClick={() => setFeedBackModal(true)}
          >
            Feedback
          </Button>
        </div> */}

        <div className="flex gap-6 px-5">
          <div
            className="cursor-pointer"
            onClick={isFullScreen ? exitFullScreen : enterFullScreen}
          >
            {isFullScreen ? (
              <FullscreenExitRoundedIcon />
            ) : (
              <FullscreenRoundedIcon />
            )}
          </div>
          <div
            className=" text-white w-full sm:w-auto cursor-pointer "
            onClick={() => setTextModal(true)}
          >
            Notes
          </div>
          <div
            className=" text-white w-full sm:w-auto cursor-pointer"
            onClick={() => setIsModalVisible(true)}
          >
            Calculator
          </div>
          <div
            className=" text-white w-full sm:w-auto cursor-pointer"
            onClick={() => setFeedBackModal(true)}
          >
            Feedback
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
