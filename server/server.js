import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';

import router from './router.mjs';
import authenticationRouter from './authentication.js';
import adminRouter from './adminManipulation.js'

import connectDB from './database/database.js';
import User from './database/user.js';

const app = express();
const port = 3000;

connectDB();

app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/auth', authenticationRouter(passport));
app.use('/admin', adminRouter);
app.use('/', router);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});