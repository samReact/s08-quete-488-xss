const app = require("./app");

app.listen(
  4000,
  () => {
    console.log("Error running express server.");
  },
  () => {
    console.log("Express server listening on port 4000.");
  }
);
