const { ipcMain } = require('electron');
const db = require('../services/database');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  register: () => {
    ipcMain.handle('payment:initiateUPI', async (event, paymentData) => {
      try {
        const {
          bookingId,
          userId,
          amount,
          upiId,
          beneficiaryName = 'IRCTC Railways'
        } = paymentData;

        const transactionId = 'UPI' + Date.now();
        const orderId = 'ORD' + Date.now();

        // Generate UPI Deep Link
        const upiLink = `upi://pay?pa=${beneficiaryName}&pn=IRCTC&am=${amount}&tn=Ticket%20Booking&tr=${transactionId}`;

        // Save transaction to database
        await db.run(
          `INSERT INTO transactions 
           (id, bookingId, userId, amount, currency, paymentMethod, upiId, orderId, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            transactionId,
            bookingId,
            userId,
            amount,
            'INR',
            'UPI',
            upiId,
            orderId,
            'initiated'
          ]
        );

        return {
          success: true,
          message: 'UPI Payment Initiated',
          transactionId,
          orderId,
          amount,
          upiLink,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('UPI Payment initiation error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('payment:confirmUPI', async (event, transactionId) => {
      try {
        // Verify payment from UPI provider (mock)
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

    ipcMain.handle('payment:getTransactionStatus', async (event, transactionId) => {
      try {
        const transaction = await db.get(
          'SELECT * FROM transactions WHERE id = ?',
          [transactionId]
        );

        if (!transaction) {
          return { success: false, message: 'Transaction not found' };
        }

        return {
          success: true,
          transaction
        };
      } catch (error) {
        return { success: false, message: error.message };
      }
    });
  }
};
