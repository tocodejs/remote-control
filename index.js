import * as jimp from "jimp";
import { httpServer } from "./src/http_server/index.js";
import robot from "robotjs";
import { WebSocketServer } from "ws";
import { drawCircle } from "./drawCircle.js";
import { logCommand } from "./logCommand.js";
import { drawHorizontalLine, drawVerticalLine } from "./drawLines.js";
import { moveMouse } from "./moveMouse.js";

const HTTP_PORT = 8000;
const WEB_SOCKET_PORT = 9000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const wsServer = new WebSocketServer({ port: WEB_SOCKET_PORT });

const onConnect = (wsClient) => {
  wsClient.send("Upgraded to WebSocket");
  console.log(`Upgrade to WebSocket on ${WEB_SOCKET_PORT}`);
  wsClient.on("message", function (message) {
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
      moveMouse(command, distanse, mouse, xCord, yCord);
      logCommand(command);
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
    } else if (command.indexOf("prnt_scrn") !== -1) {
    } else if (command.indexOf("mouse_position") !== -1) {
      wsClient.send(`mouse_position ${mouse.x},${mouse.y}`);
      logCommand(command);
    }
  });

  wsClient.on("close", function () {
    console.log("Websocket closed");
  });
};

wsServer.on("connection", onConnect);
