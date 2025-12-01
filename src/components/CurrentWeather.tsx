import React from 'react'
import { assets } from '../assets/assets'

function weatherCodeToIcon(code) {
  if (code === 0) return assets.sunny
  if (code <= 3) return assets.partly
  if (code <= 48) return assets.fog
  if (code <= 67) return assets.drizzle
  if (code <= 77) return assets.snow
  if (code <= 88) return assets.rain
  if (code <= 99) return assets.storm
  return assets.sunny
}

function weatherCodeToText(code) {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Fog'
  if (code <= 67) return 'Drizzle'
  if (code <= 77) return 'Snow'
  if (code <= 88) return 'Rain'
  if (code <= 99) return 'Thunderstorm'
  return 'Clear'
}

export default function CurrentWeather({ current, location, units, daily }) {
  const temp = units === 'metric' 
    ? Math.round(current.temperature)
    : Math.round((current.temperature * 9/5) + 32)
  
  const code = daily.weathercode[0]
  const bgImage = window.innerWidth >= 1024 ? assets.bgTodayLarge : assets.bgTodaySmall

  return (
    <div
      className="relative bg-cover bg-center rounded-3xl p-12 lg:p-16 text-white overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-3">{location.name}, {location.country}</h2>
          <p className="text-gray-200 text-lg mb-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
          <p className="text-gray-300 text-lg">{weatherCodeToText(code)}</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <img src={weatherCodeToIcon(code)} alt="Weather" className="w-32 h-32 lg:w-40 lg:h-40" />
          <div className="text-7xl lg:text-8xl font-bold">{temp}°</div>
        </div>
      </div>
    </div>
  )
}