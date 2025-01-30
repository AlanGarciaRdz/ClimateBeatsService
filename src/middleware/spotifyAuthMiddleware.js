const axios = require('axios');
const config = require('../config/config');

/**
 * Middleware to fetch Spotify access token
 */

const spotifyAuthMiddleware = async (req, res, next) => {
  try {
    //Fetch access token from spotify
    const response = await axios.post(
      config.spotify.tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${config.spotify.clientId}:${config.spotify.clientSecret}`).toString('base64')}`,
        },
      }
    );

    //attach access token to the request object
    req.spotifyAccessToken = response.data.access_token;
    next();
  } catch (error) {
    console.error('Error fetching Spotify access token', error.message);
    res.status(500).json({ error: 'Failed to authenticate with Spotify' });
  }
};

module.exports = spotifyAuthMiddleware;
