const { ipcMain } = require('electron');
const authHandler = require('./auth');
const trainsHandler = require('./trains');
const bookingHandler = require('./booking');
const tatkalHandler = require('./tatkal');
const paymentHandler = require('./payment');

authHandler.register();
trainsHandler.register();
bookingHandler.register();
tatkalHandler.register();
paymentHandler.register();

console.log('✅ All IPC handlers registered');
