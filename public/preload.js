const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  register: (userData) => ipcRenderer.invoke('auth:register', userData),
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  logout: () => ipcRenderer.invoke('auth:logout'),
  searchTrains: (searchParams) => ipcRenderer.invoke('trains:search', searchParams),
  getTrainDetails: (trainId) => ipcRenderer.invoke('trains:details', trainId),
  bookTicket: (bookingData) => ipcRenderer.invoke('booking:book', bookingData),
  getBookingHistory: () => ipcRenderer.invoke('booking:history'),
  cancelBooking: (bookingId) => ipcRenderer.invoke('booking:cancel', bookingId),
  setupTatkalReminder: (trainData) => ipcRenderer.invoke('tatkal:setup', trainData),
  cancelTatkalReminder: (reminderId) => ipcRenderer.invoke('tatkal:cancel', reminderId),
  getTatkalReminders: () => ipcRenderer.invoke('tatkal:reminders'),
  initiatePayment: (paymentData) => ipcRenderer.invoke('payment:initiate', paymentData),
  confirmPayment: (transactionId) => ipcRenderer.invoke('payment:confirm', transactionId)
});
