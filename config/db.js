const mongoose = require('mongoose');
const chalk = require('chalk');

mongooseOptions = {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true};
const connectDb = () => {
  mongoose.connect(process.env.MONGO_URI, mongooseOptions);
}

var db = mongoose.connection;
db.on('error', function() {
  console.error(chalk.red.bold('MongoDB connection failed'));
});
db.once('open', function() {
  console.log(chalk.green(`MongoDB connected at: ${chalk.italic(db.host)}`));
});

module.exports = connectDb;
