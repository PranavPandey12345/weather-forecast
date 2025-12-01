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

export default function Forecast({ daily, units, onSelectDay, selectedIndex }) {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Daily forecast</h3>
      <div className="grid grid-cols-3 lg:grid-cols-7 gap-4">
        {daily.time.slice(0, 7).map((date, i) => {
          const d = new Date(date)
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
          const maxTemp = units === 'metric'
            ? Math.round(daily.temperature_2m_max[i])
            : Math.round((daily.temperature_2m_max[i] * 9/5) + 32)
          const minTemp = units === 'metric'
            ? Math.round(daily.temperature_2m_min[i])
            : Math.round((daily.temperature_2m_min[i] * 9/5) + 32)

          return (
            <button
              key={date}
              onClick={() => onSelectDay(i)}
              className={`p-6 rounded-xl transition transform hover:scale-105 ${
                selectedIndex === i
                  ? 'bg-slate-600 border-2 border-blue-500 shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <p className="text-sm text-gray-300 mb-4 font-medium">{dayName}</p>
              <img src={weatherCodeToIcon(daily.weathercode[i])} alt="Weather" className="w-14 h-14 mx-auto mb-4" />
              <div className="text-center">
                <p className="font-bold text-lg">{maxTemp}°</p>
                <p className="text-gray-400 text-sm">{minTemp}°</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}