const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Define the statistics log file path
const statisticsLogFile = path.join(__dirname, '../logs/statistics.log');
const errorLogFile = path.join(__dirname, '../logs/error.log');

//Logger specific format and file transportation
const statisticsLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({
      filename: statisticsLogFile,
      level: 'info',
      silent: false, // Only logs info-level messages
    }),
  ],
});

//error
const errorLogger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.File({
      filename: errorLogFile,
      level: 'error', // Only logs error-level messages
      silent: false,
    }),
  ],
});

// log request stats into the file
const logRequestStat = (stat) => {
  statisticsLogger.info(JSON.stringify(stat));
};

const logError = (errorMessage) => {
  errorLogger.error(errorMessage);
};

// Function get statistics reading the log file
const getStatistics = () => {
  try {
    // Read the statistics log file
    const data = fs.readFileSync(statisticsLogFile, 'utf8');
    const logs = data
      .trim() // Remove extra spaces/newlines
      .split('\n') // Split log entries by line
      .map((line) => {
        try {
          // Extract only the JSON ignoring the first part
          const jsonStart = line.indexOf('{');
          const jsonString = line.slice(jsonStart);

          // Parse the extracted JSON
          return JSON.parse(jsonString);
        } catch (error) {
          console.error('Error parsing log entry:', error.message);
          return null; // Return null if parsing fails
        }
      })
      .filter((log) => log !== null); // Remove any null values due to errors

    return {
      totalRequests: logs.length,
      requests: logs.map((log) => ({
        timestamp: log.timestamp,
        endpoint: log.endpoint,
        duration: log.duration,
        tracks: log.tracks,
      })),
    };
  } catch (error) {
    console.error('Error reading statistics file:', error.message);
    return { totalRequests: 0, requests: [] };
  }
};

module.exports = { logRequestStat, logError, getStatistics };
