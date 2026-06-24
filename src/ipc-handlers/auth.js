const { ipcMain } = require('electron');
const db = require('../services/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = 'your-secret-key-change-in-production';

module.exports = {
  register: () => {
    ipcMain.handle('auth:register', async (event, userData) => {
      try {
        const { email, password, fullName, phone } = userData;

        const existingUser = await db.get(
          'SELECT id FROM users WHERE email = ?',
          [email]
        );

        if (existingUser) {
          return { success: false, message: 'Email already registered' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await db.run(
          `INSERT INTO users (id, email, password, fullName, phone, createdAt)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          [userId, email, hashedPassword, fullName, phone]
        );

        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

        return {
          success: true,
          message: 'Registration successful',
          token,
          user: { userId, email, fullName, phone }
        };
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('auth:login', async (event, credentials) => {
      try {
        const { email, password } = credentials;

        const user = await db.get(
          'SELECT * FROM users WHERE email = ?',
          [email]
        );

        if (!user) {
          return { success: false, message: 'Invalid email or password' };
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
          return { success: false, message: 'Invalid email or password' };
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        return {
          success: true,
          message: 'Login successful',
          token,
          user: { userId: user.id, email: user.email, fullName: user.fullName, phone: user.phone }
        };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('auth:logout', async () => {
      return { success: true, message: 'Logged out successfully' };
    });
  }
};
