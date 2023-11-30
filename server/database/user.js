import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  creationDate: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  role: String,
  tasks: [taskSchema],
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

userSchema.methods.validatePassword = function (password) {
  return password === this.password;
};

const UserModel = mongoose.model('User', userSchema, 'users');

export default UserModel;
