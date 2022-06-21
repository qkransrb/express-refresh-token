const express = require("express");
const { config } = require("dotenv");
const database = require("./config/database");

const app = express();

config();

database();

app.use(express.json());

app.use("/api", require("./routes/authRoute"));
app.use("/api/refreshToken", require("./routes/tokenRoute"));
app.use("/api/users", require("./routes/userRoute"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
