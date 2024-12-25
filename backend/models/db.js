const mongoose = require("mongoose");
require(`dotenv`).config();

const DB_URI = process.env.DB_URI;

mongoose
  .connect(`${DB_URI}`)
  .then(() => {
    console.log("DB Ready to use");
  })
  .catch((err) => {
    console.log(err);
  });
