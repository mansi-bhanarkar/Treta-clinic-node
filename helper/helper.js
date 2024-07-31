const moment = require('moment'); // Import moment.js for date/time manipulation

function generateNumericCaseId() {
  const min = 100000000; // Minimum 9-digit number (100,000,000)
  const max = 999999999; // Maximum 9-digit number (999,999,999)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isFutureAndPresentDate(value) {
  const appointmentDate = new Date(value);
  const now = new Date();
  if (appointmentDate < now) {
    throw new Error('Appointment Date must be a present or future date');
  }
  return true;
}
// Helper function to generate time endTime
function generateTimeSlots(startTime, endTime, gapInHours) {
  const timeSlots = [];
  let currentTime = moment(startTime, 'HH:mm:ss');

  while (currentTime.isSameOrBefore(moment(endTime, 'HH:mm:ss'))) {
    timeSlots.push(currentTime.format('HH:mm:ss'));
    currentTime.add(gapInHours, 'hours');
  }

  return timeSlots;
}
module.exports = {
  generateNumericCaseId,
  isFutureAndPresentDate,
  generateTimeSlots
}