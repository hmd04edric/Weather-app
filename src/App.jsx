import React, { useState } from 'react';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import Spinner from './components/Spinner';
import ToggleDarkMode from './components/ToggleDarkMode';
import { FaLocationArrow } from 'react-icons/fa';

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weatherType, setWeatherType] = useState('default');

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  console.log("API Key:", import.meta.env.VITE_OPENWEATHER_API_KEY);

  const fetchWeather = async (lat = null, lon = null) => {
    setLoading(true);
    try {
      let url;
      if (lat && lon) {
        // Nếu có tọa độ, sử dụng tọa độ để lấy thời tiết
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi`;
      } else {
        // Ngược lại sử dụng tên thành phố
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod !== 200) throw new Error(data.message);

      // Cập nhật tên thành phố nếu sử dụng vị trí
      if (lat && lon) {
        setCity(data.name);
      }

      const forecastUrl = lat && lon 
        ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=vi&cnt=40`
        : `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=vi&cnt=40`;

      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();

      // Lấy dữ liệu cho 5 ngày tiếp theo, mỗi ngày lấy 1 mẫu lúc 12:00 trưa
      const dailyForecast = [];
      const addedDays = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString(); // Chuỗi đại diện cho ngày
        
        // Nếu chưa thêm ngày này và đang trong khoảng 12-15h (đảm bảo lấy được dữ liệu gần 12h nhất)
        if (!addedDays.has(dateString) && date.getHours() >= 12 && date.getHours() <= 15) {
          dailyForecast.push(item);
          addedDays.add(dateString);
          
          // Dừng khi đã có đủ 5 ngày
          if (dailyForecast.length >= 5) break;
        }
      }

      setWeather(data);
      setForecast(dailyForecast);
      
      // Xác định loại thời tiết để thay đổi giao diện
      if (data.weather[0].main) {
        const mainWeather = data.weather[0].main.toLowerCase();
        if (['thunderstorm', 'drizzle', 'rain'].includes(mainWeather)) {
          setWeatherType('rainy');
        } else if (['snow'].includes(mainWeather)) {
          setWeatherType('snowy');
        } else if (['clouds'].includes(mainWeather)) {
          setWeatherType('cloudy');
        } else if (['clear'].includes(mainWeather)) {
          // Phân biệt ngày/đêm dựa trên thời gian mặt trời mọc/lặn
          const now = Date.now() / 1000; // Thời gian hiện tại (giây)
          const isDaytime = now > data.sys.sunrise && now < data.sys.sunset;
          setWeatherType(isDaytime ? 'sunny' : 'night');
        } else {
          setWeatherType('default');
        }
      }
    } catch (err) {
      alert('Không thể lấy dữ liệu thời tiết!');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          setLoading(false);
          alert('Không thể lấy vị trí của bạn. Vui lòng thử lại hoặc nhập tên thành phố.');
          console.error('Lỗi lấy vị trí:', error);
        }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ định vị. Vui lòng nhập tên thành phố.');
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 transition-all duration-500 ${
      weatherType === 'sunny' ? 'bg-gradient-to-br from-blue-400 to-yellow-200' :
      weatherType === 'rainy' ? 'bg-gradient-to-br from-gray-400 to-blue-600' :
      weatherType === 'snowy' ? 'bg-gradient-to-br from-blue-100 to-blue-300' :
      weatherType === 'cloudy' ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
      weatherType === 'night' ? 'bg-gradient-to-br from-gray-800 to-blue-900' :
      'bg-blue-50'
    } dark:bg-gray-900`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 w-full">
          <h1 className="text-3xl font-bold text-blue-800 dark:text-white mb-4 md:mb-0">Dự báo thời tiết</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Nhập tên thành phố..."
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
              />
              <button 
                onClick={() => fetchWeather()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                title="Tìm kiếm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button 
              onClick={handleLocationClick}
              className="p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              title="Sử dụng vị trí hiện tại"
            >
              <FaLocationArrow className="text-gray-700 dark:text-gray-300" />
            </button>
            <ToggleDarkMode />
          </div>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {weather && <WeatherCard data={weather} />}
            {forecast.length > 0 && (
              <div className="mt-8">
                <h2 className={`text-xl font-semibold mb-4 ${
                  ['rainy', 'night'].includes(weatherType) ? 'text-white' : 'text-gray-800 dark:text-white'
                }`}>Dự báo 5 ngày tới</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecast.map((item, index) => (
                    <ForecastCard key={index} data={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
