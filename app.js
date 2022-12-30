require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connectDB = require("./db/connect");
const cors = require("cors");

//Routers
const restaurantRouter = require("./routes/restaurants");
const ordersRouter = require("./routes/orders");
const menuRouter = require("./routes/menu");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

//Middleware
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticationMiddleware = require("./middleware/authenticationMiddleware");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.send("YTU-Cafeteria");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use(authenticationMiddleware);
app.use("/api/v1/menu", menuRouter);

app.use("/api/v1/users", userRouter);

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

module.exports = app;
