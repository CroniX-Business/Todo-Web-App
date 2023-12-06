import express from 'express';
import bodyParser from 'body-parser';
import { Strategy as LocalStrategy } from 'passport-local';

import UserModel from './database/user.js';

const authenticationRouter = express.Router();

authenticationRouter.use(bodyParser.json());

export default function configureAuth(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user || !user.validatePassword(password)) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return done(new Error('User not found'));
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  authenticationRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.json({ success: false, message: info.message });
      }

      req.logIn(user, async (err) => {
        if (err) {
          return next(err);
        }

        try {
          const userFromDB = await UserModel.findOne({ email: user.email });

          if (!userFromDB) {
            return res.json({ success: false, message: 'User not found in the database' });
          }

          res.cookie('username', userFromDB.username, { maxAge: 60 * 60 * 1000 });

          if (userFromDB.role === 'admin') {
            return res.json({ message: 'Authentication successful', success: true, redirect: '/admin' });
          } else {
            return res.json({ message: 'Authentication successful', success: true, redirect: '/todo' });
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          return res.json({ success: false, message: 'Internal Server Error' });
        }
      });
    })(req, res, next);
  });

  authenticationRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.json({ success: false, message: 'Email is already in use' });
      }

      const username = email.split('@')[0];

      const newUser = new UserModel({
        email: email,
        username: username,
        password: password,
        role: 'user',
        tasks: [],
      });

      await newUser.save();

      res.json({ success: true, message: 'User registered successfully', user: newUser, redirect: '/' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  return authenticationRouter;
}