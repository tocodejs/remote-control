import * as jimp from "jimp";
import { httpServer } from "./src/http_server/index.js";
import robot from "robotjs";
import { WebSocketServer } from "ws";
import { drawCircle } from "./drawCircle.js";
import { logCommand } from "./logCommand.js";
import { drawHorizontalLine, drawVerticalLine } from "./drawLines.js";

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
    let mouse = robot.getMousePos();
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
    if (
      command.indexOf("draw_square ") !== -1 ||
      command.indexOf("draw_rectangle") !== -1
    ) {
      let xDisatnse = +command.split(" ")[1];
      let yDisatnse = +command.split(" ")[1];

      if (command.indexOf("draw_rectangle") !== -1) {
        yDisatnse = +command.split(" ")[2];
      }

      drawVerticalLine(xCord, yCord, yCord + yDisatnse, 1);
      drawHorizontalLine(xCord, yCord + yDisatnse, xCord + xDisatnse, 1);
      drawVerticalLine(xCord + xDisatnse, yCord + yDisatnse, yCord, -1);
      drawHorizontalLine(xCord + xDisatnse, yCord, xCord, -1);

      logCommand(command);
      wsClient.send(command);
    } else if (command.indexOf("draw_circle") !== -1) {
      drawCircle(distanse, xCord, yCord);
      logCommand(command);
      wsClient.send(command);
    }
  });
}
