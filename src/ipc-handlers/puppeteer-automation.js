const { ipcMain } = require('electron');
const puppeteer = require('puppeteer');
const db = require('../services/database');
const bcrypt = require('bcryptjs');

const IRCTC_URL = 'https://www.irctc.co.in/nget/login';
const BOOKING_URL = 'https://www.irctc.co.in/nget/booking';

let browser = null;
let automationStatus = {
  isRunning: false,
  currentStep: 'idle',
  progress: 0,
  logs: []
};

const addLog = (message) => {
  automationStatus.logs.push({
    timestamp: new Date().toISOString(),
    message
  });
};

module.exports = {
  register: () => {
    ipcMain.handle('automation:startTatkalBooking', async (event, bookingData) => {
      try {
        if (automationStatus.isRunning) {
          return { success: false, message: 'Automation already running' };
        }

        automationStatus.isRunning = true;
        automationStatus.currentStep = 'initializing';
        automationStatus.progress = 0;
        automationStatus.logs = [];

        const { irctcUserId, trainData } = bookingData;

        // Get IRCTC credentials
        const irctcUser = await db.get(
          'SELECT * FROM irctc_users WHERE id = ?',
          [irctcUserId]
        );

        if (!irctcUser) {
          return { success: false, message: 'IRCTC User not found' };
        }

        // Decrypt password (in production, use proper encryption)
        const password = irctcUser.password; // Should be decrypted from encrypted storage

        // Launch browser
        addLog('Launching Chrome browser...');
        automationStatus.progress = 10;

        if (!browser) {
          browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: null
          });
        }

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        // Navigate to IRCTC
        addLog('Opening IRCTC website...');
        automationStatus.progress = 20;
        await page.goto(IRCTC_URL, { waitUntil: 'networkidle2', timeout: 30000 });

        // Fill credentials
        addLog('Filling login credentials...');
        automationStatus.progress = 30;
        
        try {
          await page.type('#loginUsername', irctcUser.username, { delay: 100 });
          addLog('Username filled');
          
          await page.type('#loginPassword', password, { delay: 100 });
          addLog('Password filled');

          // Wait for CAPTCHA (user must solve manually)
          addLog('⚠️ Please solve CAPTCHA and click LOGIN manually');
          automationStatus.progress = 40;

          // Wait for navigation after login
          await Promise.race([
            page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
            new Promise(resolve => setTimeout(resolve, 60000))
          ]);

          // Navigate to search trains
          addLog('Searching for trains...');
          automationStatus.progress = 50;
          await page.goto(BOOKING_URL, { waitUntil: 'networkidle2' });

          // Fill booking form
          const { from, to, date, seatClass } = trainData;

          // From station
          addLog(`Selecting from station: ${from}`);
          await page.click('input[placeholder="From Station"]');
          await page.type('input[placeholder="From Station"]', from, { delay: 100 });
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');

          // To station
          addLog(`Selecting to station: ${to}`);
          await page.click('input[placeholder="To Station"]');
          await page.type('input[placeholder="To Station"]', to, { delay: 100 });
          await page.keyboard.press('ArrowDown');
          await page.keyboard.press('Enter');

          // Date
          addLog(`Selecting date: ${date}`);
          await page.click('input[type="date"]');
          await page.type('input[type="date"]', date, { delay: 100 });

          // Seat class
          addLog(`Selecting seat class: ${seatClass}`);
          const selectOptions = await page.$$eval('select', selects => 
            selects.map(s => s.name)
          );
          
          if (selectOptions.includes('classType')) {
            await page.select('select[name="classType"]', seatClass);
          }

          // Search
          addLog('Searching trains...');
          automationStatus.progress = 60;
          await page.click('#searchBtn, button[type="submit"]');
          await page.waitForNavigation({ waitUntil: 'networkidle2' });

          addLog('Trains found! Selecting available train...');
          automationStatus.progress = 70;

          // Select first available train
          const trains = await page.$$('.train-row');
          if (trains.length > 0) {
            await trains[0].click();
            addLog('Train selected');
          }

          // Fill passenger details
          addLog('Filling passenger details...');
          automationStatus.progress = 80;
          
          await page.type('#passengerName', irctcUser.passengerName, { delay: 100 });
          await page.select('select[name="gender"]', irctcUser.gender || 'M');
          await page.type('#passengerAge', irctcUser.age || '25', { delay: 100 });

          addLog('Confirming booking...');
          automationStatus.progress = 90;
          await page.click('#confirmBtn, button:contains("Confirm")');

          addLog('✅ Booking completed successfully!');
          automationStatus.progress = 100;

          return {
            success: true,
            message: 'Tatkal booking completed!',
            logs: automationStatus.logs
          };

        } catch (bookingError) {
          addLog(`❌ Error: ${bookingError.message}`);
          return {
            success: false,
            message: 'Booking failed: ' + bookingError.message,
            logs: automationStatus.logs
          };
        }
      } catch (error) {
        addLog(`❌ Fatal error: ${error.message}`);
        return { success: false, message: error.message, logs: automationStatus.logs };
      } finally {
        automationStatus.isRunning = false;
      }
    });

    ipcMain.handle('automation:getStatus', async () => {
      return automationStatus;
    });

    ipcMain.handle('automation:stopBooking', async () => {
      try {
        if (browser) {
          await browser.close();
          browser = null;
        }
        automationStatus.isRunning = false;
        return { success: true, message: 'Automation stopped' };
      } catch (error) {
        return { success: false, message: error.message };
      }
    });
  }
};
