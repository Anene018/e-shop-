require('dotenv').config();
require('express-async-errors');
// var admin = require("firebase-admin");

// var serviceAccount = require("./e-shop-9c1d5-firebase-adminsdk-wroot-f1497ab3dd.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket : 'gs://e-shop-9c1d5.appspot.com'
// });


const express = require('express');
const app = express();

const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const walletRouter = require('./routes/wallet');
const productRouter = require('./routes/products')
const cartRouter = require('./routes/cart')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


app.use(express.json());

// routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/user', walletRouter);
app.use('/api/products', productRouter);
app.use('/api/user/cart', cartRouter);



app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_DB_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
