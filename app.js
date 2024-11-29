const express = require('express')
const cors = require('cors')

const usersRouter = require('./routes/usersRoutes.js');

const app = express();

app.use(cors({
    origin: '*',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders:['Content-Type']
}))

app.use(express.json());
app.use('/',usersRouter);

module.exports = app;