const express = require("express");
const todosRouter = require("./routes/todos.routes");
const authenticateApiKey = require("./middlewares/authenticateApiKey");

const app = express();

app.use(express.json());


app.use("/todos", authenticateApiKey, todosRouter);

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
