import connectDB from './database.js';
import UserModel from './user.js';
import mongoose from 'mongoose';

// Connect to the database
connectDB();

const userEmail = 'user@example.com';

// Find the user by email
/*UserModel.findOne({ email: userEmail })
    .then((foundUser) => {
        if (!foundUser) {
            console.log(`User with email ${userEmail} not found.`);
            mongoose.connection.close();
            return;
        }

        // Find the maximum taskId in the user's tasks
        const maxTaskId = foundUser.tasks.reduce((max, task) => (task.taskId > max ? task.taskId : max), 0);

        // Add a new task with a unique taskId
        const newTaskId = maxTaskId + 1;

        const newTask = {
            taskId: newTaskId,
            taskName: 'New Task 3',
            // Other properties of the task...
        };

        foundUser.tasks.push(newTask);

        // Save the updated user with the new task
        return foundUser.save();
    })
    .then((updatedUser) => {
        if (updatedUser) {
            console.log('User found and new task added:', updatedUser);
        }
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error('Error finding user or adding new task:', error);
        mongoose.connection.close();
});
*/

//found task by array index
/*UserModel.findOne({ email: userEmail })
    .then((foundUser) => {
        if (!foundUser) {
            console.log(`User with email ${userEmail} not found.`);
            mongoose.connection.close();
            return;
        }

        // Log details of the first task
        const firstTask = foundUser.tasks[1];
        if (firstTask) {
            console.log('Details of the first task:', firstTask);
        } else {
            console.log('No tasks found for the user.');
        }

        mongoose.connection.close();
    })
*/

//delete task by array index
/*UserModel.findOne({ email: userEmail })
    .then((foundUser) => {
        if (!foundUser) {
            console.log(`User with email ${userEmail} not found.`);
            mongoose.connection.close();
            return;
        }

        if (foundUser.tasks.length >= 2) {
            const updatedTasks = foundUser.tasks.filter((task, index) => index !== 1);
            foundUser.tasks = updatedTasks;
            console.log('Second task removed.');

            // Save the updated user with the modified tasks array
            return foundUser.save();
        } else {
            console.log('No second task to remove.');
            return foundUser.save(); // Still save the user without modification
        }
    })
    .then((updatedUser) => {
        console.log('User saved:', updatedUser);
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error('Error finding user or updating tasks:', error);
        mongoose.connection.close();
    });
*/