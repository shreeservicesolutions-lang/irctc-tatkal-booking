const { ipcMain } = require('electron');
const db = require('../services/database');

module.exports = {
  register: () => {
    // Get dashboard stats
    ipcMain.handle('dashboard:getStats', async (event, userId) => {
      try {
        const bookings = await db.all(
          'SELECT COUNT(*) as count FROM bookings WHERE userId = ?',
          [userId]
        );

        const tatkalReminders = await db.all(
          'SELECT COUNT(*) as count FROM tatkal_reminders WHERE userId = ? AND status = ?',
          [userId, 'active']
        );

        const confirmedBookings = await db.all(
          'SELECT COUNT(*) as count FROM bookings WHERE userId = ? AND status = ?',
          [userId, 'confirmed']
        );

        return {
          success: true,
          stats: {
            totalBookings: bookings[0]?.count || 0,
            tatkalReminders: tatkalReminders[0]?.count || 0,
            confirmedBookings: confirmedBookings[0]?.count || 0
          }
        };
      } catch (error) {
        return { success: false, message: error.message };
      }
    });
  }
};
