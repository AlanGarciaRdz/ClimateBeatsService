require('dotenv').config();

module.exports = {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    tokenUrl: 'https://accounts.spotify.com/api/token',
    apiBaseUrl: 'https://api.spotify.com/v1',
  },
  openWeatherMap: {
    apiKey: process.env.OPENWEATHERMAP_API_KEY,
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  },
  server: {
    port: process.env.PORT || 3000,
  },
};
