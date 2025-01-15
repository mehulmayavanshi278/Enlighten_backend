const { logRouter } = require("../routes/log.routes");
const { taskRouter } = require("../routes/task.routes");


module.exports = (app) => {
  const ErrorHandler = require("../middlewares/errorHandler");
  const express = require("express");
  const { userRouter } = require("../routes/user.routes");

  app.use("/user", userRouter);
  app.use("/task", taskRouter);
  app.use("/log", logRouter);





  app.use(ErrorHandler);

  app.get("/", (req, res) => res.send("Welcome Educonnect!"));

  app.get("*", (req, res) => {
    res.status(400).send({ error: true, message: "Route not Found" });
  });
};
