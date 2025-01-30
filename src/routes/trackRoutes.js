const express = require('express');
const SpotifyService = require('../services/spotifyService');
const WeatherService = require('../services/weatherService');
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

    res.json({ temperature, tracks });
  } catch (error) {
    console.error('Error fetching tracks', error.message);
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

module.exports = router;
