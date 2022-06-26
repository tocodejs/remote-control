import robot from "robotjs";
export const moveMouse = (command, distanse, mouse, xCord, yCord) => {
  if (command.indexOf("mouse_left") !== -1) {
    xCord = mouse.x - distanse;
  } else if (command.indexOf("mouse_right") !== -1) {
    xCord = mouse.x + distanse;
  } else if (command.indexOf("mouse_up") !== -1) {
    yCord = mouse.y - distanse;
  } else if (command.indexOf("mouse_down") !== -1) {
    yCord = mouse.y + distanse;
  }
  robot.moveMouse(xCord, yCord);
};
