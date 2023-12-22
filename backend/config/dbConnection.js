const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
        "mongodb://127.0.0.1:27017/homeworkUnicorn"
    );
    console.log(
      "Database connected"
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDb;
