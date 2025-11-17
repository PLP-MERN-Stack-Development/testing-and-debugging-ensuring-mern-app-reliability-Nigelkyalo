/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Post = require('../src/models/Post');

const TEST_DB_URI = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/mern_app_test';
const ENV_FILE = path.resolve(process.cwd(), '.env.test');

async function ensureEnvFile() {
  let content = '';
  if (fs.existsSync(ENV_FILE)) {
    content = fs.readFileSync(ENV_FILE, 'utf-8');
  }

  const entries = new Map(
    content
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split('=').map((item) => item.trim()))
  );

  entries.set('MONGO_URI', TEST_DB_URI);
  entries.set('JWT_SECRET', entries.get('JWT_SECRET') || 'super-secret-key');

  const serialized = Array.from(entries.entries())
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
    .concat('\n');

  fs.writeFileSync(ENV_FILE, serialized);
  console.log(`Updated ${ENV_FILE} with test database configuration`);
}

async function seedTestData() {
  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return;
  }

  const user = await User.create({
    username: 'test-author',
    email: 'author@test.com',
    password: 'password123',
    role: 'author'
  });

  await Post.create({
    title: 'Sample Test Post',
    content: 'This is a seeded post used for integration testing.',
    author: user._id,
    category: new mongoose.Types.ObjectId(),
    status: 'published'
  });

  console.log('Seeded default user and post for tests');
}

async function main() {
  await ensureEnvFile();
  await mongoose.connect(TEST_DB_URI);
  console.log(`Connected to test database at ${TEST_DB_URI}`);
  await seedTestData();
  await mongoose.disconnect();
  console.log('Test database is ready to use ✅');
}

main().catch((error) => {
  console.error('Failed to setup test database', error);
  process.exit(1);
});

