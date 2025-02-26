import dotenv from 'dotenv';
import fetch from 'node-fetch';


dotenv.config();

console.log(process.env.BASE_URL);
console.log(process.env.API_KEY);

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
interface Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties

  private baseURL = process.env.BASE_URL;
  private apiKey = process.env.API_KEY;

    // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(city: string) {
    const url = `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}`;
    console.log("Request URL:", url);
    const response = await fetch(url);
    const data: any = await response.json();
  
    // Assuming the API returns coordinates in the data
    if (!data.coord) {
      throw new Error('Location not found');
    }
    return { lat: data.coord.lat, lon: data.coord.lon };
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private async fetchWeatherData(coords: Coordinates): Promise<any> {
      const url = `${this.baseURL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}`;
      console.log('Request URL:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error! Status: ${response.statusText}`);
      }
      return await response.json();
    }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(data: any): Weather {
    return {
      temperature: data.main.temp,  // Access 'temp' from 'main'
      description: data.weather[0].description,  // Access 'description' from 'weather'
      humidity: data.main.humidity,  // Access 'humidity' from 'main'
      windSpeed: data.wind.speed  // Access 'wind_speed' from 'wind'
    };
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  public async getWeatherForCity(city: string): Promise<Weather> {
    const coords = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coords);
    console.log('Weather Data:', weatherData);
    return this.parseCurrentWeather(weatherData);
  }
}
const weatherService = new WeatherService();


export default weatherService;
