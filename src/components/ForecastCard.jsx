import React from 'react';

const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const ForecastCard = ({ data }) => {
  const date = new Date(data.dt * 1000);
  const dayOfWeek = days[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const dateStr = `${day}/${month}`;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
      <p className="text-sm font-medium">{dayOfWeek}</p>
      <p className="text-xs text-gray-500">{dateStr}</p>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt={data.weather[0].description}
        className="mx-auto"
      />
      <p className="text-lg">{data.main.temp}°C</p>
      <p className="text-sm capitalize">{data.weather[0].description}</p>
    </div>
  );
};

export default ForecastCard;
