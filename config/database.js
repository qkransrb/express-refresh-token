const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error}`);
    process.exit(1);
  }
};
