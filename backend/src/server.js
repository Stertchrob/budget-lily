const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled rejection:", reason);
});

const app = require("./app");

const port = process.env.BACKEND_PORT || 4000;
app.listen(port, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running on port ${port}`);
});
