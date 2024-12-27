import React, { useEffect, useState } from "react";
import { Button } from "antd";
import AccessAlarmsRoundedIcon from "@mui/icons-material/AccessAlarmsRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";

const Header = ({ config }) => {
  const {
    setTextModal,
    setFeedBackModal,
    exam,
    currentIndex,
    setIsModalVisible,

    enterFullScreen,
    exitFullScreen,
    isFullScreen,
  } = config;

  const [time, setTime] = useState(180); // Time in seconds (3 minutes)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval); // Stop the timer when it reaches 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Update the time every second

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between p-2 px-4 bg-blue-900 text-white">
        {/* Left Section */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 text-left">
          <h1 className="text-lg font-bold">NCLEX-RN TEST - TONY ALEX</h1>
        </div>

        {/* Middle Section (Hidden on smaller screens) */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 hidden lg:flex flex-col sm:flex-row gap-1">
          <p className="text-sm">Test Id: 370626716 (Tutored, Untimed)</p>
          <p className="text-sm">QId: 31736 (5031545)</p>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end w-full sm:w-auto">
          <div>
            <div className="flex justify-start items-center gap-2 mb-1">
              <h4>Time</h4>
              <span>
                <AccessAlarmsRoundedIcon />
              </span>
              <h4>{formatTime(time)}</h4>
            </div>

            <div className="flex justify-start items-center gap-2">
              <h4>Question</h4>
              <span>
                <HelpRoundedIcon />
              </span>
              <h4>{`${currentIndex + 1} of ${exam?.questions?.length}`}</h4>
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
