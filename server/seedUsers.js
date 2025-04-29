import User from './models/User.js';

const usersData = [
  { username: 'alice' },
  { username: 'bob' },
  { username: 'charlie' },
  { username: 'david' },
  { username: 'eve' }
];

const seedUsers = async () => {
  try {
    const existingUsers = await User.find();
    if (existingUsers.length === 0) {
      await User.insertMany(usersData);
      console.log('Sample users inserted.');
    } else {
      console.log('Users already exist, skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export default seedUsers;
