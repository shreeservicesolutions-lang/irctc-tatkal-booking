# 🚂 IRCTC Tatkal Ticket Booking Desktop Software

A modern desktop application for Indian Railway ticket booking with advanced Tatkal auto-booking capabilities.

## ✨ Features

- **User Authentication**: Secure registration and login
- **Train Search**: Search trains by route, date, and class
- **Tatkal Auto-Booking**: Automatic ticket booking at scheduled times
- **Real-time Seat Availability**: Live seat tracking
- **Payment Integration**: Secure payment processing
- **Booking Management**: View, modify, and cancel bookings
- **E-Ticket Generation**: Digital ticket downloads
- **Booking History**: Track all past bookings

## 🛠 Tech Stack

- **Frontend**: Electron + React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Authentication**: JWT + bcrypt
- **Scheduling**: node-schedule

## 📋 Prerequisites

- Node.js 14+
- npm or yarn
- Windows, macOS, or Linux

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/shreeservicesolutions-lang/irctc-tatkal-booking.git
cd irctc-tatkal-booking
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

This will start both the React dev server and Electron app.

### 4. Build production app
```bash
npm run build
```

## 📁 Project Structure

```
irctc-tatkal-booking/
├── public/
│   ├── electron.js          # Electron main process
│   ├── preload.js           # IPC preload script
│   └── index.html           # HTML template
├── src/
│   ├── ipc-handlers/        # Electron IPC handlers
│   │   ├── auth.js
│   │   ├── booking.js
│   │   ├── payment.js
│   │   ├── tatkal.js
│   │   └── trains.js
│   ├── services/
│   │   └── database.js      # SQLite database
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── SearchTrainsPage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── TatkalSetupPage.jsx
│   │   └── BookingHistoryPage.jsx
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Key Features Explanation

### Tatkal Auto-Booking
- Set up reminders for specific trains
- Automatic booking attempts at Tatkal opening times
- AC classes: 10:00 AM | Non-AC: 11:00 AM
- Scheduled with node-schedule

### Database Schema
- **Users**: User account information
- **Bookings**: Ticket bookings and PNR details
- **Tatkal Reminders**: Scheduled auto-booking reminders
- **Transactions**: Payment records
- **Seats**: Train seat availability

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Secure IPC communication
- Context isolation in Electron

## 📝 Usage

1. **Register**: Create a new account with email and phone
2. **Search**: Find trains between stations
3. **Book**: Select passengers and book tickets
4. **Tatkal**: Set up auto-booking for Tatkal quota
5. **Payment**: Complete payment online
6. **Manage**: View bookings and download e-tickets

## 🔗 Integration Points

### IRCTC API Integration
Replace mock data in `src/ipc-handlers/trains.js` with actual IRCTC API calls

### Payment Gateway
Integrate Razorpay or PayU in `src/ipc-handlers/payment.js`

## 📦 Building for Production

### Windows
```bash
npm run build
# Creates .exe installer
```

### macOS
```bash
npm run build
# Creates .dmg installer
```

### Linux
```bash
npm run build
# Creates .AppImage
```

## 🐛 Troubleshooting

### App won't start
- Delete `node_modules` and reinstall: `npm install`
- Clear Electron cache

### Database errors
- Delete `db/irctc.db` to reset database
- Check database permissions

### IPC communication issues
- Ensure preload script is properly configured
- Check context isolation settings in electron.js

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: shreeservicesolutions@email.com

## 📄 License

MIT License - see LICENSE file for details

---

**Happy Booking! 🎫🚂**
