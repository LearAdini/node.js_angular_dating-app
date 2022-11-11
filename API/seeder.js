const fs = require("fs");
const mongoose = require("mongoose");

const User = require('./models/Users.js')

// Connect to DB
mongoose
.connect('mongodb://127.0.0.1:27017/datingApp')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })

const users = JSON.parse(
    fs.readFileSync('./seedUsersJson.json', "utf-8")
  );
  
  // Add data
  const importData = async () => {
    try {
      await User.create(users);
      console.log("Data Imported...");
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };
  
  // Delete data
  const deleteData = async () => {
    try {
      await User.deleteMany();
      console.log("Data Destroyed...");
      process.exit();
    } catch (err) {
      console.error(err);
    }
  };
  
  if (process.argv[2] === "-i") {
    importData();
  } else if (process.argv[2] === "-d") {
    deleteData();
  }