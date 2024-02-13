import mongoose from 'mongoose';
import LogModel from './logs.js';

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDesc: { type: String },
  finished: { type: Boolean, required: true, default: false },
  Date: { type: String, required: true }  ,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
  expireAt: { type: Date, default: Date.now, index: { expires: '2592000' } }
});

const TaskModel = mongoose.model('Task', taskSchema, 'tasks');

export default TaskModel;

