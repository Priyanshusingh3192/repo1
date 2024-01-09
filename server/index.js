const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });
 
app.use('/auth',require('./routes/userRoute'));

app.use('/api',require('./routes/userRoute'));

app.use('/uploads', express.static('uploads'));
app.use('/', require('./routes/userRoute'));
// API CALL OF CHAT PAGE
app.use('/chat',require('./routes/chatRoute'));

app.use('/message', require('./routes/chatRoute'));

const port = process.env.PORT || 3000; 
const server = app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
