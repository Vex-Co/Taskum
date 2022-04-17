const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_DB_PATH);

module.exports = mongoose;