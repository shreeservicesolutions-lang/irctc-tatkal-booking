const { ipcMain } = require('electron');
const db = require('../services/database');

const MOCK_TRAINS = [
  {
    trainId: 'RAJ12001',
    trainName: 'Rajdhani Express',
    fromStation: 'NDLS',
    toStation: 'CSMT',
    departureTime: '16:00',
    arrivalTime: '08:00',
    duration: '16h 0m',
    distance: 1448,
    availableSeats: { AC1: 12, AC2: 45, AC3: 67, SL: 150 },
    basePrice: { AC1: 5500, AC2: 3500, AC3: 2500, SL: 1500 },
    runningDays: [0, 1, 2, 3, 4, 5, 6]
  },
  {
    trainId: 'SHT12002',
    trainName: 'Shatabdi Express',
    fromStation: 'NDLS',
    toStation: 'AGRA',
    departureTime: '06:00',
    arrivalTime: '09:30',
    duration: '3h 30m',
    distance: 206,
    availableSeats: { AC1: 8, AC2: 25, CC: 40 },
    basePrice: { AC1: 1500, AC2: 1000, CC: 700 },
    runningDays: [0, 1, 2, 3, 4, 5]
  }
];

module.exports = {
  register: () => {
    ipcMain.handle('trains:search', async (event, searchParams) => {
      try {
        const { from, to, date, class: ticketClass } = searchParams;

        let filteredTrains = MOCK_TRAINS.filter(train => {
          const dayOfWeek = new Date(date).getDay();
          return (
            train.fromStation === from &&
            train.toStation === to &&
            train.runningDays.includes(dayOfWeek)
          );
        });

        filteredTrains = filteredTrains.map(train => ({
          ...train,
          selectedClassSeats: train.availableSeats[ticketClass] || 0,
          selectedClassPrice: train.basePrice[ticketClass] || 0
        }));

        return {
          success: true,
          trains: filteredTrains,
          message: `Found ${filteredTrains.length} trains`
        };
      } catch (error) {
        console.error('Train search error:', error);
        return { success: false, message: error.message };
      }
    });

    ipcMain.handle('trains:details', async (event, trainId) => {
      try {
        const train = MOCK_TRAINS.find(t => t.trainId === trainId);

        if (!train) {
          return { success: false, message: 'Train not found' };
        }

        return {
          success: true,
          train
        };
      } catch (error) {
        console.error('Train details error:', error);
        return { success: false, message: error.message };
      }
    });
  }
};
