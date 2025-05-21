import React from 'react';

const getWeatherType = (weatherData) => {
  if (!weatherData?.weather?.[0]?.main) return 'default';
  
  const mainWeather = weatherData.weather[0].main.toLowerCase();
  
  if (['thunderstorm', 'drizzle', 'rain'].includes(mainWeather)) return 'rainy';
  if (['snow'].includes(mainWeather)) return 'snowy';
  if (['clouds'].includes(mainWeather)) return 'cloudy';
  if (['clear'].includes(mainWeather)) {
    const now = Date.now() / 1000;
    const isDaytime = now > weatherData.sys.sunrise && now < weatherData.sys.sunset;
    return isDaytime ? 'sunny' : 'night';
  }
  return 'default';
};

const weatherIcons = {
  sunny: '☀️',
  rainy: '🌧️',
  snowy: '❄️',
  cloudy: '☁️',
  night: '🌙',
  default: '🌈',
};

const WeatherCard = ({ data }) => {
  const weatherType = getWeatherType(data);
  const weatherIcon = weatherIcons[weatherType] || '🌡️';
  
  return (
    <div className={`p-6 rounded-xl shadow-lg text-center backdrop-blur-sm bg-white/70 dark:bg-gray-800/80 transition-all duration-500 ${
      weatherType === 'sunny' ? 'shadow-yellow-200/30' :
      weatherType === 'rainy' ? 'shadow-blue-400/30' :
      weatherType === 'snowy' ? 'shadow-blue-200/30' :
      weatherType === 'cloudy' ? 'shadow-gray-400/30' :
      weatherType === 'night' ? 'shadow-blue-900/30' :
      'shadow-gray-300/30'
    }`}>
      <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
        <span className="text-3xl">{weatherIcon}</span>
        {data.name}
      </h2>
      <div className="flex flex-col items-center justify-center my-4">
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
          className="w-24 h-24"
        />
        <p className="text-4xl font-bold my-2">{Math.round(data.main.temp)}°C</p>
        <p className="text-lg capitalize">{data.weather[0].description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div className="bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">Độ ẩm</p>
          <p className="font-semibold">{data.main.humidity}%</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">Gió</p>
          <p className="font-semibold">{Math.round(data.wind.speed * 3.6)} km/h</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">Cảm thấy</p>
          <p className="font-semibold">{Math.round(data.main.feels_like)}°C</p>
        </div>
        <div className="bg-white/50 dark:bg-gray-700/50 p-3 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">Áp suất</p>
          <p className="font-semibold">{data.main.pressure} hPa</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
