import robot from "robotjs";
export const logCommand = (comand) => {
  let mouse = robot.getMousePos();
  console.log(`${comand} x:${mouse.x} y:${mouse.y}`);
};
