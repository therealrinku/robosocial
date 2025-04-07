const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

//server setup 
//
const port = process.env.PORT || 4000;
const server = http.createServer(app);

//routes
const post = require("./routes/post");
const user = require("./routes/user");
const auth = require("./routes/auth");
const comment = require("./routes/comment");
//redirection
app.use("/post", post);
app.use("/user", user);
app.use("/auth", auth);
app.use("/comment", comment);

//server running
server.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
