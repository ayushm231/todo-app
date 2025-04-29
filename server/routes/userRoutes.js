import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

// // Fetch all users
// router.route('/').get(getUsers);

// // Create a new user
// router.route('/').post(createUser);

router.route('/').get(getUsers).post(createUser);

export default router;
