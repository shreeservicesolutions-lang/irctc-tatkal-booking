const { ipcMain } = require('electron');
const db = require('../services/database');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  register: () => {
    ipcMain.handle('booking:book', async (event, bookingData) => {
      try {
        const {
          userId,
          trainId,
          trainName,
          date,
          passengers,
          seatClass,
          price,
          from,
          to
        } = bookingData;

        const bookingId = uuidv4();
        const pnr = 'PNR' + Date.now();

        await db.run(
          `INSERT INTO bookings 
           (id, userId, trainId, trainName, bookingDate, journeyDate, 
            passengers, seatClass, totalPrice, status, pnr, from_station, to_station, createdAt)
           VALUES (?, ?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            bookingId,
            userId,
            trainId,
            trainName,
            date,
            JSON.stringify(passengers),
            seatClass,
            price,
            'pending',
            pnr,
            from,
            to
          ]
        );

        return {
          success: true,
          message: 'Booking created successfully',
          bookingId,
          pnr
        };
      } catch (error) {
        console.error('Booking error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('booking:history', async (event) => {
      try {
        const bookings = await db.all(
          `SELECT * FROM bookings ORDER BY createdAt DESC LIMIT 50`
        );

        const formattedBookings = bookings.map(b => ({
          ...b,
          passengers: JSON.parse(b.passengers || '[]')
        }));

        return {
          success: true,
          bookings: formattedBookings
        };
      } catch (error) {
        console.error('Booking history error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('booking:cancel', async (event, bookingId) => {
      try {
        await db.run(
          'UPDATE bookings SET status = ? WHERE id = ?',
          ['cancelled', bookingId]
        );

        return {
          success: true,
          message: 'Booking cancelled successfully'
        };
      } catch (error) {
        console.error('Cancellation error:', error);
        return { success: false, message: error.message };
      }
    });
  }
};
