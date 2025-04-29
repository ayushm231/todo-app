import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';
import todoRoutes from './routes/todoRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seedUsers from './seedUsers.js';

dotenv.config();
// Connect with database
connectDB();
// Add users if collection is empty
await seedUsers();

const app = express();
app.use(cors());
app.use(express.json());

// Route for debugging if the backend is working
app.get('/test', (req, res) => {
    console.log('Test route hit');
    res.send('Backend server working!');
  });
  

app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
