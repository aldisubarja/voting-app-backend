const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // your express app
const User = require('../app/models/User');
const Vote = require('../app/models/Vote');
const { jwtSecret,mongoURI } = require('../app/modules/config');

const jwt = require('jsonwebtoken');

let userToken, adminToken, userId, adminId;

beforeAll(async () => {
  await mongoose.connect(mongoURI,{
              useNewUrlParser: true,
              useUnifiedTopology: true
            })
            .then(() => {
              console.log('MongoDB connected');
            })
            .catch(err => console.error(err));

  // Create test users
  const user = new User({ username: 'testuser', password: 'testpass', role: 'user' });
  const admin = new User({ username: 'adminuser', password: 'adminpass', role: 'admin' });
  await user.save();
  await admin.save();
  userId = user._id;
  adminId = admin._id;

  userToken = jwt.sign({ id: userId, role: 'user' }, jwtSecret, { expiresIn: '1h' });
  adminToken = jwt.sign({ id: adminId, role: 'admin' }, jwtSecret, { expiresIn: '1h' });
});

afterAll(async () => {
  await User.deleteMany({
    username: { $in: ['testuser', 'adminuser', 'newuser'] }
  });

  await Vote.deleteMany({
    user: { $in: [userId, adminId] }
  });

  await mongoose.connection.close();
});


describe('Voting App API', () => {
  test('1. Register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'newuser',
      password: 'newpass',
      role: 'user'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User created successfully');
  });

  test('2. Login user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'testpass'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('3. Vote as user', async () => {
    const res = await request(app)
      .post('/api/vote')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Candidate A' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Vote submitted successfully');
  });

  test('4. Get existing candidates', async () => {
    const res = await request(app)
      .get('/api/vote/exist')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.candidates).toContain('Candidate A');
  });

  test('5. Get vote results as admin', async () => {
    const res = await request(app)
      .get('/api/admin/results')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalVotes).toBeGreaterThan(0);
    expect(res.body.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: 'Candidate A', count: expect.any(Number) })
      ])
    );
  });

  test('6. Get all users as admin', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.users.length).toBeGreaterThan(0);
    expect(res.body.users[0]).not.toHaveProperty('password');
  });
});
