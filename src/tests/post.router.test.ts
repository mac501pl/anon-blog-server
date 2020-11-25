import mongoose from 'mongoose';
import request from 'supertest';
import app from '../index';

describe('POST /posts', () => {
  it('tests if POST returns new object', async done => {
    const body = { content: 'test', posterId: '123' };

    const expectedResult = {
      upvoters: [],
      downvoters: [],
      edited: false,
      comments: [],
      __v: 0,
      ...body
    }
    const result = await request(app).post('/posts/add').send(body);

    expect(result.status).toEqual(201);
    expect(result.body).toMatchObject(expectedResult)

    done();
  });

  it('should fail when content is not provided', async done => {
    const body = { posterId: '123' };

    const result = await request(app).post('/posts/add').send(body);

    expect(result.status).toEqual(400);

    done();
  });

  it('should fail when posterId is not provided', async done => {
    const body = { content: 'test' };

    const result = await request(app).post('/posts/add').send(body);

    expect(result.status).toEqual(400);

    done();
  });

  afterEach(async function () {
    const collections = await mongoose.connection.db.collections();
  
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  });
});

describe('GET /', () => {
  const bodies = [
    { content: 'test1', posterId: '123' },
    { content: 'test2', posterId: '456' },
    { content: 'test3', posterId: '789' }
  ];

  beforeAll(async () => {
    await Promise.all(bodies.map(body => request(app).post('/posts/add').send(body)));
  });
  
  it('should respond with array of posts', async done => {
    const result = await request(app).get('/posts');

    const expectedResult = bodies.reverse().map(body => ({
      upvoters: [],
      downvoters: [],
      edited: false,
      comments: [],
      __v: 0,
      ...body
    }));

    expect(result.status).toEqual(200);
    expect(result.body).toMatchObject(expectedResult);

    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log('Mongo test session closed!');
});
