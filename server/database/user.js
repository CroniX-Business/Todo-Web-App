import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import TaskModel from './tasks.js';

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  role: String,
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

userSchema.methods.validatePassword = function (password) {
  return password === this.password;
};

const UserModel = mongoose.model('User', userSchema, 'users');

export default UserModel;
