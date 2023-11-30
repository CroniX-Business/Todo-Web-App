import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import connectEnsureLogin from 'connect-ensure-login';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = dirname(__dirname);

const router = express.Router();

router.use(express.static(rootDir));

router.get('/', (req, res) => {
  res.sendFile(join(rootDir, '/home.html'));
});

router.get('/signUp', (req, res) => {
  res.sendFile(join(rootDir, 'src/html/signUp.html'));
});

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/todo', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
  res.sendFile(join(rootDir, 'src/html/todo.html'));
});

router.get('/settings', connectEnsureLogin.ensureLoggedIn('/'), (req, res) => {
  res.sendFile(join(rootDir, 'src/html/settings.html'));
});

const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.redirect('/todo');
};

router.get('/admin', ensureAdmin, (req, res) => {
  res.sendFile(join(rootDir, 'src/html/admin.html'));
});

export default router;