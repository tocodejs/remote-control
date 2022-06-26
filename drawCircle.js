import robot from "robotjs";
export const drawCircle = (radius, xCord, yCord) => {
  let bMouseUp = true;
  for (let i = 0; i <= Math.PI * 2; i += 0.02) {
    let x = Math.round(Math.cos(i) * radius + xCord);
    let y = Math.round(Math.sin(i) * radius + yCord);
    robot.moveMouse(x, y);
    if (bMouseUp) {
      robot.mouseToggle("down", "left");
      bMouseUp = false;
    }
  }
  robot.mouseToggle("up", "left");
};
