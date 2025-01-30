const axios = require('axios');
const config = require('../config/config');

class SpotifyService {
  /**
   * Get Tracks based on the temperature
   * @param {string} accessToken - Spotify access token middleware.
   * @param {number} temp - Current temperature
   * @returns {Array} - List of tracks names
   */

  static async getTracksbyTemperature(accessToken, temp) {
    try {
      let genre;
      let limit = 10; //limit of Tracks it will return

      //Determine genre and limit based on temperature
      if (temp > 30) {
        genre = 'party';
      } else if (temp >= 15 && temp <= 30) {
        genre = 'pop';
      } else if (temp >= 10 && temp <= 14) {
        genre = 'rock';
      } else {
        genre = 'classical';
      }

      //fetch tracks by Genre
      const response = await axios.get(`${config.spotify.apiBaseUrl}/search`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: `genre:${genre}`,
          type: 'track',
          limit,
        },
      });

      //Extract tracks details ( album name, name, artist)
      const tracks = response.data.tracks.items.map((item) => ({
        name: item.name,
        album: item.album.name,
        artist: item.artists.map((artist) => artist.name), //this is an array in case are more than one artist for a track
      }));

      return genre, tracks;
    } catch (error) {
      console.error('Error fetching tracks by temperature', error.message);
      throw new Error('Failed to fetch Tracks');
    }
  }
}

module.exports = SpotifyService;
