import { WeatherData } from './types';

const API_KEY = '7860cfc28dfc32705b2214bd46fdc2d0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (location: string): Promise<WeatherData | null> => {
  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Weather API Error: ${response.status} ${response.statusText} for location: ${location}`);
      return null;
    }

    const data = await response.json();

    // OpenWeatherMap returns timezone as offset in seconds from UTC.
    // Calculate accurate local time for the city.
    const now = new Date();
    // Get UTC time in milliseconds
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    // Add the city's timezone offset (in milliseconds)
    const cityTime = new Date(utcMs + (data.timezone * 1000));
    
    const year = cityTime.getFullYear();
    const month = String(cityTime.getMonth() + 1).padStart(2, '0');
    const day = String(cityTime.getDate()).padStart(2, '0');
    const hours = String(cityTime.getHours()).padStart(2, '0');
    const minutes = String(cityTime.getMinutes()).padStart(2, '0');
    const localtime = `${year}-${month}-${day} ${hours}:${minutes}`;

    return {
      location: {
        name: data.name,
        region: '', // Region is not provided in standard OWM response
        country: data.sys.country,
        localtime: localtime
      },
      current: {
        temp_c: Math.round(data.main.temp),
        temp_f: Math.round((data.main.temp * 9/5) + 32),
        condition: {
          text: data.weather[0].description,
          icon: `//openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        },
        wind_kph: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        humidity: data.main.humidity,
        feelslike_c: Math.round(data.main.feels_like),
        uv: 0 // UV not available in standard OWM endpoint
      }
    };
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return null;
  }
};
