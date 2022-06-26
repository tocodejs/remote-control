import robot from "robotjs";

const drawVerticalLine = (xCord, yCord, iToLoop, iStepForLoop) => {
  robot.mouseToggle("down", "left");
  while (yCord !== iToLoop) {
    yCord += iStepForLoop;
    robot.moveMouse(xCord, yCord);
  }
  robot.mouseToggle("up", "left");
};

const drawHorizontalLine = (xCord, yCord, iToLoop, iStepForLoop) => {
  robot.mouseToggle("down", "left");
  while (xCord !== iToLoop) {
    xCord += iStepForLoop;
    robot.moveMouse(xCord, yCord);
  }
  robot.mouseToggle("up", "left");
};

export { drawHorizontalLine, drawVerticalLine };
