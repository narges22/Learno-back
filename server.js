import http from "http";
import _ from "lodash";

const server = http.createServer((req, res) => {
  const number = _.random(0, 20);
  console.log("request mode", number);
});
var port = process.env.PORT || 8080;

server.listen(port, "localhost", () => {
  console.log("listening");
});
