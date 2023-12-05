import connectDB from './database.js';
import UserModel from './user.js';
import TaskModel from './tasks.js';
import LogModel from './logs.js';

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
  .then(async (savedUser) => {
    console.log('User with empty tasks saved:', savedUser);

    // Create tasks and associate them with the user
    const task1 = await TaskModel.create({
      taskName: 'Task 1',
      creationDate: '2023-01-01',
      user: savedUser._id,
    });

    const task2 = await TaskModel.create({
      taskName: 'Task 2',
      creationDate: '2023-01-01',
      user: savedUser._id,
    });

    // Log the creation of multiple tasks
    const log = await LogModel.create({
      action: 'Tasks Created',
      tasks: [task1._id, task2._id],
      user: savedUser._id,
    });

    // Add the log to the user's logs array
    savedUser.tasks.push(task1._id, task2._id);
    savedUser.logs.push(log._id);

    // Add the log to the tasks' logs arrays
    task1.logs.push(log._id);
    task2.logs.push(log._id);

    // Save the changes
    await Promise.all([savedUser.save(), task1.save(), task2.save()]);

    console.log('Tasks created and logged:', task1, task2, log);
  })
  .catch((error) => {
    console.error('Error saving user with empty tasks:', error);
  })
  .finally(() => {
    // Close the database connection
    process.exit();
  });
