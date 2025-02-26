import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (_req: Request, _res: Response) => {
  // TODO: GET weather data from city name
  const city = _req.body.city;
  if (!city) {
    return _res.status(400).json({ message: 'City name is required' });
  }
  try {
    const weather = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    return _res.json(weather);
  } catch (error) {
    console.error(error);
    return _res.status(500).json({ message: 'Server error' });
  }
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (_req: Request, _res: Response) => {
  try {
    const history = await HistoryService.getCities();
    _res.json(history);
  } catch (error) {
    console.error(error);
    _res.status(500).json({ message: 'Server error' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, _res: Response) => {
  const id = _req.params.id;
  try {
    await HistoryService.removeCity(id);
    _res.json({ message: 'City deleted' });
  } catch (error) {
    console.error(error);
    _res.status(500).json({ message: 'Server error' });
  }
});

export default router;
