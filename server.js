require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send({
    status: "Active",
  });
});

//Database Configuration
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (e) => {
    e
      ? console.log(`Error connecting to database /n ${e}`)
      : console.log(`Successfully connected to the database`);
  }
);

//routes
app.use("/api/v1/user/auth/", require("./routes/userAuthRoute"));
app.use("/api/v1/user/profile/", require("./routes/userProfileRoute"));
app.use("/api/v1/topic/", require("./routes/topicRoute"));
app.use("/api/v1/community/", require("./routes/communityRoute"));
app.use("/api/v1/post/", require("./routes/postRoute"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
