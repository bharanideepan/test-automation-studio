import logger from "./logger";
import app from "./app";

const host = app.get("host");
const port = app.get("port");
const server = app.listen(port);

process.on("unhandledRejection", (reason, p) =>
  logger.error("Unhandled Rejection at: Promise ", p, reason)
);

server.on("listening", () => {
  // logger.info("<=== Feathers application started on %s:%d ===>", host, port);
  console.log(`\n\n<===Application started===>\n\n`)
});
