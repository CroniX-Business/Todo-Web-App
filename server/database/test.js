import connectDB from './database.js';
import UserModel from './user.js';
import mongoose from 'mongoose';

// Connect to the database
connectDB();

// Create a user with empty tasks
const user = new UserModel({
    email: 'user@example.com',
    username: 'user',
    password: 'password',
    role: 'user',
    tasks: [],
});

// Save the user to the database
user.save()
    .then((savedUser) => {
        console.log('User with empty tasks saved:', savedUser);
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error('Error saving user with empty tasks:', error);
        mongoose.connection.close();
    });
