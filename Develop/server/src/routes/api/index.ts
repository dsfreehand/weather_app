import { Router } from 'express';
import weatherRoutes from './weatherRoutes.js';
import router from '../htmlRoutes.js';
const weatherRouter = Router();

router.use('/weather', weatherRoutes);

// Handle the POST request for /api/weather
weatherRouter.post('/', (req, res) => {
  // Logic to handle weather data
  console.log(req.body);  // log weather data to check if it's coming through
  res.json({ message: 'Weather data received successfully!' });
});

export default weatherRouter;
