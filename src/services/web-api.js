import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from '../services/database.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// ============ IRCTC USERS MANAGEMENT ============

// Get all IRCTC users for a specific main user
app.get('/api/irctc-users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const users = await db.all(
      `SELECT id, username, fullName, passengerName, gender, age, createdAt 
       FROM irctc_users WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new IRCTC user
app.post('/api/irctc-users', async (req, res) => {
  try {
    const { userId, username, password, fullName, passengerName, gender, age } = req.body;
    const { v4: uuidv4 } = await import('uuid');
    const bcrypt = await import('bcryptjs');

    const irctcId = uuidv4();
    const hashedPassword = await bcrypt.default.hash(password, 10);

    await db.run(
      `INSERT INTO irctc_users 
       (id, userId, username, password, fullName, passengerName, gender, age, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [irctcId, userId, username, hashedPassword, fullName, passengerName, gender, age]
    );

    res.json({ 
      success: true, 
      message: 'IRCTC User added successfully',
      irctcId 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update IRCTC user
app.put('/api/irctc-users/:irctcId', async (req, res) => {
  try {
    const { irctcId } = req.params;
    const { username, fullName, passengerName, gender, age } = req.body;

    await db.run(
      `UPDATE irctc_users 
       SET username = ?, fullName = ?, passengerName = ?, gender = ?, age = ?
       WHERE id = ?`,
      [username, fullName, passengerName, gender, age, irctcId]
    );

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete IRCTC user
app.delete('/api/irctc-users/:irctcId', async (req, res) => {
  try {
    const { irctcId } = req.params;
    await db.run('DELETE FROM irctc_users WHERE id = ?', [irctcId]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ BOOKINGS MANAGEMENT ============

app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await db.all(
      `SELECT * FROM bookings WHERE userId = ? ORDER BY createdAt DESC LIMIT 100`,
      [userId]
    );
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ TATKAL REMINDERS ============

app.get('/api/tatkal-reminders/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const reminders = await db.all(
      `SELECT * FROM tatkal_reminders WHERE userId = ? AND status = 'active' ORDER BY tatkalDate ASC`,
      [userId]
    );
    res.json({ success: true, reminders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ TRANSACTIONS ============

app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await db.all(
      `SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 50`,
      [userId]
    );
    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Web Dashboard API running on http://localhost:${PORT}`);
});
