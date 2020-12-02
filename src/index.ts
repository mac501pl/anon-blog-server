import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import postsRouter from './routes/posts.router';

dotenv.config({ path: __dirname + '../../.env' });

const getDbUri = (): string => {
  switch (process.env.NODE_ENV) {
  case 'development':
    return 'mongodb://localhost:27017/dev';
  case 'production':
    return 'mongodb://mongo:27017/dev';
  case 'test':
    return 'mongodb://localhost:27017/test';
  default:
    throw Error('Invalid environment!');
  }
}

const app = express();
const port = 5000;
const dbUri = getDbUri();

app.use(cors());
app.use(express.json());

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(()=> {
    console.log('MongoDB database connected!', dbUri);
  }).catch(error => {
    console.error(error);
    console.error('Connection string:', dbUri);
  });

mongoose.connection.once('open', () => {
  console.log('MongoDB database connection open');
});

mongoose.connection.on('error', error => {
  console.error(error);
});

app.use('/posts', postsRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  })
}

export default app;
