import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;


// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// TODO: Implement middleware to connect the routes
app.use('/api', routes);



  // Weather API Route to get weather data for a city
  app.get('/api/weather', async (req, res) => {
    const { city } = req.query;  // Get the city query parameter
  
    // If no city is provided, return an error
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
  
    try {
      const encodedCity = encodeURIComponent(city as string); // Encode the city name
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${process.env.OPENWEATHER_API_KEY}`;
  
      // Using fetch instead of axios
      const response = await fetch(weatherUrl);
  
      // If response is not okay, throw an error
      if (!response.ok) {
        throw new Error(`API error! Status: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
  
      // Return the weather data from OpenWeather API to the client
      return res.json(data);
    } catch (error: unknown) {
      console.error('Error fetching weather data:', error);
  
      // Handle errors
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
  
      // General error fallback
      return res.status(500).json({ error: 'Error with the weather request' });
    }
  });

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
  });

// Start the server on the port
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
