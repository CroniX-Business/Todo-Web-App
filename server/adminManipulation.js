import express from 'express';
import UserModel from './database/user.js';
import TaskModel from './database/tasks.js';
import LogModel from './database/logs.js';

const adminRouter = express.Router();

async function getUsers() {
  try {
    const users = await UserModel.find({}, 'email role');
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function deleteUserById(userId) {
  try {
    const result = await UserModel.findByIdAndDelete(userId);
    return result;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

adminRouter.get('/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

adminRouter.delete('/users/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await deleteUserById(userId);

    if (result) {
      await TaskModel.deleteMany({ user: userId });
      await LogModel.deleteMany({ user: userId });

      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

adminRouter.put('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { userEmail, userRole } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (userEmail && !emailRegex.test(userEmail)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  try {
    if (userEmail) {
      const existingUser = await UserModel.findOne({ email: userEmail });

      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ success: false, message: 'Email is already in use' });
      }
    }

    const updateFields = {};
    if (userEmail) {
      updateFields.email = userEmail;
      updateFields.username = userEmail.split('@')[0];
    }
    if (userRole) {
      updateFields.role = userRole;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (updatedUser) {
      res.json({ success: true, message: 'User updated successfully', user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default adminRouter;
