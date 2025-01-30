const express = require('express');
const SpotifyService = require('../services/spotifyService');
const WeatherService = require('../services/weatherService');
const {
  logRequestStat,
  logError,
  getStatistics,
} = require('../services/loggerService');
const spotifyAuthMiddleware = require('../middleware/spotifyAuthMiddleware');

const router = express.Router();

//Apply the middleware to routes that need Spotify access token
router.use(spotifyAuthMiddleware);

/**
 * Get /tracks?city={city}  or tacks?lat
 * Get tracks based on the temperature of the specified city
 */

router.get('/tracks', async (req, res) => {
  const { city, lat, lon } = req.query;

  if (!city && !(lat && lon)) {
    return res
      .status(400)
      .json({ error: 'City of coordinates (lat, lon) are required' });
  }

  try {
    let temperature;
    let location = city || `${lat}, ${lon}`; //Logger
    let startTime = Date.now();

    //STEP1: Fetch tempreature based on city or coord
    if (city) {
      temperature = await WeatherService.getTemperatureByCity(city);
    } else {
      temperature = await WeatherService.getTemperatureByCoordinates(lat, lon);
    }

    //STEP2: Fetch tracks by the temp
    const tracks = await SpotifyService.getTracksbyTemperature(
      req.spotifyAccessToken,
      temperature
    );
    let endTime = Date.now(); //log end
    let duration = endTime - startTime;

    // Log request details to the file
    const requestDetails = {
      timestamp: new Date().toISOString(),
      endpoint: req.originalUrl,
      duration: duration,
      location: location,
      tracks: tracks,
    };
    // Log request details
    logRequestStat(requestDetails); // Log to file

    res.json({ temperature, tracks });
  } catch (error) {
    console.error('Error fetching tracks', error.message);
    logError(`Error: ${error.message} at ${new Date().toISOString()}`);
    res
      .status(500)
      .json({ error: 'Failed to fetch tracks', message: error.message });
  }
});

// Add the /stats endpoint
router.get('/stats', (req, res) => {
  const stats = getStatistics(); // Read the statistics from the file
  res.json(stats);
});

module.exports = router;
