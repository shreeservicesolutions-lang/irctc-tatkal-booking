const { ipcMain } = require('electron');
const db = require('../services/database');
const schedule = require('node-schedule');
const { v4: uuidv4 } = require('uuid');

const TATKAL_TIMES = {
  'AC1': '10:00',
  'AC2': '10:00',
  'AC3': '11:00',
  'SL': '11:00',
  'CC': '10:00'
};

const reminders = new Map();

module.exports = {
  register: () => {
    ipcMain.handle('tatkal:setup', async (event, trainData) => {
      try {
        const {
          userId,
          trainId,
          trainName,
          from,
          to,
          date,
          seatClass,
          passengers,
          price
        } = trainData;

        const reminderId = uuidv4();
        const tatkalTime = TATKAL_TIMES[seatClass] || '10:00';

        await db.run(
          `INSERT INTO tatkal_reminders 
           (id, userId, trainId, trainName, tatkalDate, tatkalTime, seatClass, 
            passengers, totalPrice, status, from_station, to_station, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
          [
            reminderId,
            userId,
            trainId,
            trainName,
            date,
            tatkalTime,
            seatClass,
            JSON.stringify(passengers),
            price,
            'active',
            from,
            to
          ]
        );

        const [hours, minutes] = tatkalTime.split(':');
        const cronExpression = `${minutes} ${hours} * * *`;

        const job = schedule.scheduleJob(cronExpression, async () => {
          console.log(`⏰ Tatkal reminder triggered for ${trainName}`);
          event.sender.send('tatkal:reminder-triggered', {
            reminderId,
            trainId,
            trainName,
            message: `Tatkal booking is now open for ${trainName}!`
          });
        });

        reminders.set(reminderId, job);

        return {
          success: true,
          message: 'Tatkal reminder set successfully',
          reminderId,
          tatkalTime
        };
      } catch (error) {
        console.error('Tatkal setup error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('tatkal:cancel', async (event, reminderId) => {
      try {
        const job = reminders.get(reminderId);
        if (job) {
          job.cancel();
          reminders.delete(reminderId);
        }

        await db.run(
          'UPDATE tatkal_reminders SET status = ? WHERE id = ?',
          ['cancelled', reminderId]
        );

        return {
          success: true,
          message: 'Tatkal reminder cancelled'
        };
      } catch (error) {
        console.error('Tatkal cancellation error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('tatkal:reminders', async (event) => {
      try {
        const remindersList = await db.all(
          `SELECT * FROM tatkal_reminders WHERE status = 'active' ORDER BY tatkalDate ASC`
        );

        return {
          success: true,
          reminders: remindersList
        };
      } catch (error) {
        console.error('Fetching reminders error:', error);
        return { success: false, message: error.message };
      }
    });
  }
};
