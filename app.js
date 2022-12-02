require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const cors = require("cors");

//Routers
const ordersRouter = require("./routes/orders");

const app = express();

//Middleware
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("YTU-Cafeteria");
});

app.use("/api/v1/orders", ordersRouter);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Sever is listening at port ${port}....`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();

exports.module = app;
