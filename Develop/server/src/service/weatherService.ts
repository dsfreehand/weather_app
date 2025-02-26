import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

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
    const url = `${this.baseURL}/geocoding/v5/mapbox.places/${city}.json?access_token=${this.apiKey}`;
    const response = await fetch(url);
    const data: any = await response.json();
    return {lat: data.coord.lat, lon: data.coord.lon};
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = `${this.baseURL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly,daily&appid=${this.apiKey}`;
    const response = await fetch(url);
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
      temperature: data.current.temp,
      description: data.current.weather[0].description,
      humidity: data.current.humidity,
      windSpeed: data.current.wind_speed
    };
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  public async getWeatherForCity(city: string): Promise<Weather> {
    const coords = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coords);
    return this.parseCurrentWeather(weatherData);
  }
}
const weatherService = new WeatherService();


export default weatherService;
