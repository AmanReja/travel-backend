const express = require("express");
const dotenv = require("dotenv");
const { mongoose } = require("mongoose");
const cors = require("cors");
dotenv.config();
const port = 5000 || process.env.PORT;
const app = express();
app.use(express.json());
const mongooString = process.env.DATA_BASE;

const dataBase = mongoose.connection;

mongoose.connect(mongooString);

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.send("hellow");
});
app.get("/fb", (req, res) => {
  res.send("hellow i am a server");
});

try {
  dataBase.on("error", (error) => {
    console.log(error);
  });

  dataBase.once("connected", () => {
    console.log("Database connected");
  });
} catch (error) {
  console.log("error in mogoose connection", error);
}

const user_controller = require("./Controllers/user_controller");
app.use("/user", user_controller);

const teacher_controller = require("./Controllers/teacher_controller");
app.use("/teacher", teacher_controller);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
