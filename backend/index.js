const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const db = require("./models/db");

app.use(cors());
app.use(express.json());

const userRouter = require("./routes/userRouter");
app.use("/users", userRouter);

const roleRouter = require("./routes/roleRouter");
app.use("/roles", roleRouter);

const postRouter = require("./routes/postRouter");
app.use("/posts", postRouter);

const commentRouter = require("./routes/commentRouter");
app.use("/comments", commentRouter);

const likeRouter = require("./routes/likeRouter");
app.use("/likes", likeRouter);



app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
