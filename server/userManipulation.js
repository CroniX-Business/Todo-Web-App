import express from 'express';
import UserModel from './database/user.js';
import TaskModel from './database/tasks.js';

const userRouter = express.Router();

userRouter.post('/tasks', async (req, res) => {
    const { date } = req.body;
    const userEmail = req.user.email;

    if (!date) {
        res.status(400).json({ success: false, message: 'Date not provided' });
        return;
    }

    await getTasksByDate(userEmail, date, res);
});

async function getTasksByDate(userEmail, specificDate, res) {
    try {
        const user = await UserModel.findOne({ email: userEmail })
            .populate({
                path: 'tasks',
                match: { creationDate: specificDate },
                populate: { path: 'logs' },
            })
            .exec();

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.json({ success: true, tasks: user.tasks });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

userRouter.post('/task/save', async (req, res) => {
    const { taskName, taskDesc, creationDate } = req.body;
    const userEmail = req.user.email;

    if (!taskName || !creationDate) {
        res.status(400).json({ success: false, message: 'Task name or creation date not provided' });
        return;
    }

    try {
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const newTask = new TaskModel({
            taskName,
            taskDesc,
            creationDate,
            user: user._id,
        });

        const savedTask = await newTask.save();

        user.tasks.push(savedTask._id);
        await user.save();

        res.json({ success: true, task: savedTask });
    } catch (error) {
        console.error('Error creating and saving task:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

userRouter.post('/task/delete', async (req, res) => {
    const { taskId } = req.body;
    const userEmail = req.user.email;

    if (!taskId) {
        res.status(400).json({ success: false, message: 'Task ID not provided' });
        return;
    }

    try {
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const deletedTask = await TaskModel.findOneAndDelete({ _id: taskId });

        if (!deletedTask) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        user.tasks = user.tasks.filter(task => task.toString() !== taskId);
        await user.save();

        res.json({ success: true, task: deletedTask });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

userRouter.post('/task/finished', async (req, res) => {
    const { taskId } = req.body;
    const userEmail = req.user.email;
  
    if (!taskId) {
      res.status(400).json({ success: false, message: 'Task ID not provided' });
      return;
    }
  
    try {
      const user = await UserModel.findOne({ email: userEmail });
  
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
  
      const updatedTask = await TaskModel.findByIdAndUpdate(
        taskId,
        { $set: { finished: true } },
        { new: true }
      );
  
      if (!updatedTask) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }
  
      res.json({ success: true, task: updatedTask });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  


userRouter.post('/settings', async (req, res) => {
    const { setting, param } = req.body;

    const userEmail = req.user.email;
    console.log(userEmail);

    let result;

    switch (setting) {
        case 'changeName':
            result = await changeName(userEmail, param, res);
            break;
        case 'changeEmail':
            result = await changeEmail(userEmail, param, res);
            break;
        case 'changePassword':
            result = await changePassword(userEmail, param, res);
            break;
        case 'deactivateAccount':
            result = await deleteAccount(userEmail, param, res);
            break;
        default:
            return res.status(400).json({ error: 'Invalid setting' });
    }
});

async function changeName(userEmail, param, res) {
    try {
        if (param.trim() === '') {
            res.json({ success: false, message: 'Empty field' });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { email: userEmail },
            { $set: { username: param } },
            { new: true }
        );

        if (!updatedUser) {
            res.json({ success: false, message: 'Error while updating user' });
        }

        res.cookie('username', param, { maxAge: 60 * 60 * 1000 });
        res.json({ success: true });

    } catch (error) {
        console.error('Error:', error);
        return 'error';
    }
}

async function changePassword(userEmail, param, res) {
    try {
        if (param.trim() === '') {
            res.json({ success: false, message: 'Empty field' });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { email: userEmail },
            { $set: { password: param } },
            { new: true }
        );

        if (!updatedUser) {
            res.json({ success: false, message: 'Error while updating user' });
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Error:', error);
        return 'error';
    }
}

async function changeEmail(userEmail, param, res) {
    try {
        if (param.trim() === '') {
            res.json({ success: false, message: 'Empty field' });
        }

        const updatedUser = await UserModel.findOneAndUpdate(
            { email: userEmail },
            { $set: { email: param } },
            { new: true }
        );

        if (!updatedUser) {
            res.json({ success: false, message: 'Error while updating user' });
        }

        res.json({ success: true, redirect: '/' });

    } catch (error) {
        console.error('Error:', error);
        return 'error';
    }
}

async function deleteAccount(userEmail, param, res) {
    try {
        const deletedUser = await UserModel.findOneAndDelete({ email: userEmail });

        if (!deletedUser) {
            res.json({ success: false, message: 'Error while deleting user' });
        }

        res.json({ success: true, redirect: '/signUp' });
    } catch (error) {
        console.error('Error:', error);
        return 'error';
    }
}

export default userRouter;