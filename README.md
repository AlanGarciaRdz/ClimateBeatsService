# ClimateBeatsService

A RESTful microservice that suggests music tracks based on the current temperature of a city or geographical coordinates.
This service integrates OpenWeather API for temperature data and Spotify API for music recommendations.

## Prerequisites

- Node.js v20.13.1
- npm (comes with Node.js)
- OpenWeather API key
- Spotify Developer account with API credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/AlanGarciaRdz/ClimateBeatsService.git
cd ClimateBeatsService
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
PORT=3000
OPENWEATHERMAP_API_KEY=your_openweather_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic reloading during development.

### Production Mode

```bash
npm start
```

## API Endpoints

### Documentation of the API:

Please take a look to my documentation publish at:
[API Documentation](http://184.72.206.67/documentation/api-documentation.html)

### Health Check

```
GET /
Response: "ClimateBeatsService is running!"
```

### Get Music Recommendations

```
GET /api/tracks
```

Query Parameters (use either city OR coordinates):

- `city`: Name of the city (string)
  - Example: `/api/tracks?city=zapopan`
- OR
- `lat`: Latitude (number)
- `lon`: Longitude (number)
  - Example: `/api/tracks?lat=13.0475255&lon=80.2086732`

Example Response:

```json
{
  "temperature": 23.5,
  "tracks": [
    {
      "name": "Track Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "url": "Spotify URL"
    }
    // ... more tracks
  ]
}
```

### Get Service Statistics

```
GET /api/stats
```

Returns statistics about service usage, including request details and performance metrics.

Example Response:

```json
{
  "requestStats": [
    {
      "timestamp": "2024-01-30T10:00:00.000Z",
      "endpoint": "/api/tracks",
      "duration": 1234,
      "location": "zapopan",
      "tracks": [...]
    }
    // ... more stats
  ]
}
```

### Error Handling

The service implements a comprehensive error handling strategy:

1. **Operational Errors**:

   - API timeout handling
   - Rate limit management
   - Invalid input validation

2. **Programming Errors**:

   - Global error handler
   - Async error wrapper
   - Validation error handler

3. **Error Logging**:
   - Error stack traces
   - Request context

### Invalid Request

```json
{
  "error": "City or coordinates (lat, lon) are required"
}
```

### Server Error

```json
{
  "error": "Failed to fetch tracks",
  "message": "Error details..."
}
```

## Project Structure

```
ClimateBeatsService/
├── src/
│   ├── app.js                       # Application entry point
│   ├── config/
│   │   └──config.js                 # Configuration settings
│   ├── logs/
│   │   └── error.log                # error logs
│   │   └── statistics.log           # stats logs
│   ├── routes/
│   │   └── trackRoutes.js           # API route handlers
│   ├── services/
│   │   ├── weatherService.js        # Weather API integration
│   │   ├── spotifyService.js        # Spotify API integration
│   │   └── loggerService.js         # Logging service
│   ├── middleware/
│   │   └── spotifyAuthMiddleware.js # Spotify authentication
│   └── utils/
├── tests/                           # Test files
├── .env                            # Environment variables
├── .gitignore                      # Git ignore file
├── package.json                    # Project dependencies
├── ecosystem.config.json           # Pm2 ecosystem
├── LICENSE                         # MIT license
├── eslint.config.mjs               # esling config
└── README.md                       # This file
```

## Scripts

- `npm start`: Start the production server
- `npm run dev`: Start development server with hot reload
- `npm run lint`: Run ESLint code analysis
- `npm run format`: Format code using Prettier
- `npm test`: Run Jest tests
- `npm run deploy`: Deploy to specified server (requires SSH key)

## Development

### Code Style

The project uses ESLint and Prettier for code formatting. Configuration files are included in the repository.

### Testing

The project uses Jest for testing. The test suite includes unit tests and integration tests for all major components.

Run all tests:

```bash
npm test
```

### Test Coverage

The test suite covers:

- API endpoints
- Health check
- `/api/tracks` with city parameter Zapopan
- `/api/tracks` with coordinates lat & Lon
- `/api/tracks` Error handler without location provided
- `/api/tracks` Error handler invalida coordinates
- `/api/stats` endpoint

### Deployment

The project includes a deployment script that uses rsync to deploy to a specified server & ask admin (alan.josue.garcia.rdz@gmail.com) in case you need access.

```bash
npm run deploy
```

Note: This requires proper SSH key configuration (`challenge.pem`).

## Environment Variables

- `PORT`: Server port (default: 3000)
- `OPENWEATHERMAP_API_KEY`: OpenWeather API key
- `SPOTIFY_CLIENT_ID`: Spotify API client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify API client secret

## Solution Details

### Architecture Overview

The ClimateBeatsService follows a microservice architecture pattern with the following key characteristics:

- **Service-Oriented**: Independent service focusing on a single business capability
- **RESTful API Design**: Following REST principles for clear and consistent API endpoints
- **Middleware-based Authentication**: Centralized Spotify authentication handling
- **Separation of Concerns**: Clear distinction between routes, services, and middleware
- **Stateless Operation**: No session state maintained between requests

### Design Patterns

1. **Middleware Pattern**

   - Authentication middleware for Spotify token management
   - Error handling middleware for consistent error responses
   - Logging middleware for request tracking

2. **Service Layer Pattern**

   - Separate services for Weather, Spotify, and Logging
   - Encapsulated business logic within respective services
   - Clean separation between data access and business rules

3. **Factory Pattern**
   - Service instantiation with dependency injection
   - Centralized configuration management

### Technical Stack

#### Core Framework and Runtime

- **Node.js**: v20.13.1 runtime environment
- **Express.js**: Web application framework
- **PM2**: Production process manager

#### External APIs

- **OpenWeather API**: Weather data provider
- **Spotify API**: Music recommendation engine

#### Development Tools

- **ESLint**: Code linting with custom configuration
- **Prettier**: Code formatting
- **Jest**: Testing framework

#### Logging and Monitoring

- **Winston**: Logging framework

### Security Measures

1. **API Security**:

   - Rate limiting
   - CORS configuration
   - Input validation
   - Environment variable protection

2. **Authentication**:
   - Spotify OAuth 2.0
   - Token validation

## Infrastructure Requirements

### Minimum Specifications

- CPU: 1 vCPU
- RAM: 1 GB
- Storage: 10 GB SSD
- Network: 100 Mbps

### Recommended Specifications

- CPU: 2 vCPU
- RAM: 2 GB
- Storage: 20 GB SSD
- Network: 1 Gbps

## License

MIT

## Support

For support, please open an issue in the GitHub repository.
