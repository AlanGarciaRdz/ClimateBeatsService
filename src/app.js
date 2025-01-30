const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const trackRoutes = require('./routes/trackRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('ClimateBeatsService is running!');
});

app.use('/api', trackRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
