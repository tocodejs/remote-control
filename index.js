import * as jimp from "jimp";
import { httpServer } from "./src/http_server/index.js";
import robot from "robotjs";
import { WebSocketServer } from "ws";

const HTTP_PORT = 8000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: 9000 });

wsServer.on("connection", onConnect);

function onConnect(wsClient) {
  wsClient.send("Upgraded to WebSocket");
  wsClient.on("message", function (message) {
    console.log(message.toString());
    let command = message.toString();
    var mouse = robot.getMousePos();
    let xCord = mouse.x;
    let yCord = mouse.y;
    let distanse = +command.split(" ")[1];
    if (
      command.indexOf("_left") !== -1 ||
      command.indexOf("_down") !== -1 ||
      command.indexOf("_right") !== -1 ||
      command.indexOf("_up") !== -1
    ) {
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
      wsClient.send(command);
    }
    if (command.indexOf("draw_square ") !== -1) {
      drawVerticalLine(xCord, yCord, yCord + distanse, 1);
      drawHorizontalLine(xCord, yCord, xCord + distanse, 1);
      drawVerticalLine(xCord, yCord, yCord - distanse, -1);
      drawHorizontalLine(xCord, yCord, xCord - distanse, -1);
      wsClient.send(command);
    }
    function drawVerticalLine(xPos, yPos, iToLoop, iStepForLoop) {
      let i = 0;
      while (yCord !== iToLoop) {
        yCord += iStepForLoop;
        robot.moveMouse(xCord, yCord);
      }
    }
    function drawHorizontalLine(xPos, yPos, iToLoop, iStepForLoop) {
      while (xCord !== iToLoop) {
        xCord += iStepForLoop;
        robot.moveMouse(xCord, yCord);
      }
    }
  });
}

robot.setMouseDelay(2);

/*var twoPI = Math.PI * 2.0;
var screenSize = robot.getScreenSize();
var height = (screenSize.height / 2) - 10;
var width = screenSize.width;
 
for (let x = 0; x < width; x++)
{
   let y = height * Math.sin((twoPI * x) / width) + height;
   // robot.moveMouse(x, y);
}*/
