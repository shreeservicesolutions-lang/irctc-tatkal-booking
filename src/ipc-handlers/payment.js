const { ipcMain } = require('electron');
const db = require('../services/database');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  register: () => {
    ipcMain.handle('payment:initiate', async (event, paymentData) => {
      try {
        const {
          bookingId,
          userId,
          amount,
          currency = 'INR'
        } = paymentData;

        const transactionId = 'TXN' + Date.now();

        await db.run(
          `INSERT INTO transactions 
           (id, bookingId, userId, amount, currency, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            transactionId,
            bookingId,
            userId,
            amount,
            currency,
            'initiated'
          ]
        );

        return {
          success: true,
          message: 'Payment initiated',
          transactionId,
          paymentDetails: {
            amount,
            currency,
            transactionId,
            timestamp: new Date().toISOString()
          }
        };
      } catch (error) {
        console.error('Payment initiation error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('payment:confirm', async (event, transactionId) => {
      try {
        await db.run(
          'UPDATE transactions SET status = ? WHERE id = ?',
          ['completed', transactionId]
        );

        const transaction = await db.get(
          'SELECT * FROM transactions WHERE id = ?',
          [transactionId]
        );

        if (transaction) {
          await db.run(
            'UPDATE bookings SET status = ? WHERE id = ?',
            ['confirmed', transaction.bookingId]
          );
        }

        return {
          success: true,
          message: 'Payment confirmed successfully',
          transactionId
        };
      } catch (error) {
        console.error('Payment confirmation error:', error);
        return { success: false, message: error.message };
      }
    });
  }
};
