const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');
const connectDB = require('./config/db');
const xssSanitize = require('./middleware/xss');
const errorMiddleware = require('./middleware/error');
const {authResponse} = require('./middleware/auth');

const authRouter = require('./routes/auth');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({path: './config/.dev.env'});
} else if (process.env.NODE_ENV === 'production') {
  dotenv.config({path: './config/.prod.env'});
}

const V1_ROUTE_PATH = '/api/v1/';

connectDB();

const app = express();

app.use(express.json());
app.use(authResponse());
app.use(xssSanitize());
app.use(hpp());
app.use(mongoSanitize());
// app.use(cors()); // allow all cross-domain connections
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.use(`${V1_ROUTE_PATH}auth/`, authRouter);

app.get('/', (req, res) => {
  res.send('hi');
})

app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(
  port, () => console.log(chalk.green.bold(`Server started in ${process.env.NODE_ENV} mode on port ${port}`))
);

process.on('unhandledRejection', (err) => {
  console.error(chalk.red(`Error: ${err.message}`));
});
