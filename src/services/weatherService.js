const axios = require('axios');
const config = require('../config/config');

class WeatherService {
  /***
   * Finds the CityID by city name
   * @param {string} city - name of the city
   * @returns {string} - City ID
   */

  static async findCityId(city) {
    try {
      const response = await axios.get(
        `${config.openWeatherMap.baseUrl}/find`,
        {
          params: {
            q: city,
            appid: config.openWeatherMap.apiKey,
            units: 'metric', //Celsius
          },
        }
      );

      //Get CityID from the first result
      if (response.data.list.length > 0) {
        return response.data.list[0].id;
      } else {
        throw new Error('City Not Found');
      }
    } catch (error) {
      console.error('Error finding city ID', error.message);
      throw new Error('Failed to find city ID');
    }
  }

  /**
   * Fetches the current tempreature for a city
   * @param {string} city - name of the city
   * @returns {number} - Temperature in celsius
   */

  static async getTemperatureByCity(city) {
    try {
      //Step 1: Find city ID
      const cityID = await this.findCityId(city);

      //Step 2: Fetch weather data using the cityID
      const response = await axios.get(
        `${config.openWeatherMap.baseUrl}/weather`,
        {
          params: {
            id: cityID,
            appid: config.openWeatherMap.apiKey,
            units: 'metric', //Celsius
          },
        }
      );
      return response.data.main.temp;
    } catch (error) {
      console.error('Error fetching temperature by city:', error.message);
      throw new Error('Failed to fetch temperature data');
    }
  }

  static async getTemperatureByCoordinates(lat, lon) {
    try {
      const response = await axios.get(
        `${config.openWeatherMap.baseUrl}/weather`,
        {
          params: {
            lat,
            lon,
            appid: config.openWeatherMap.apiKey,
            units: 'metric', //Celsius
          },
        }
      );
      return response.data.main.temp;
    } catch (error) {
      console.error('Error fetching temp by coordinates:', error.message);
      throw new Error('Failed to fetch temperature data');
    }
  }
}

module.exports = WeatherService;
