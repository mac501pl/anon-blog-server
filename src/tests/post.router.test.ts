import mongoose from 'mongoose';
import request from 'supertest';
import app from '../index';

describe('POST /posts', () => {
  it('tests endpoint', async done => {
    const result = await request(app).post('/posts/add').send({ content: 'test', posterId: '123' });
    expect(result.status).toEqual(201);
    done();
  });

  afterAll(async () => {
    await mongoose.connection.close()
  });
});
