import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'

function groupHoursByDay(hourly, daily) {
  const groups = {}
  hourly.time.forEach((t, idx) => {
    const day = new Date(t).toISOString().slice(0, 10)
    groups[day] = groups[day] || { time: [], temp: [] }
    groups[day].time.push(t)
    groups[day].temp.push(hourly.temperature_2m[idx])
  })
  return daily.time.map((d) => groups[d] || { time: [], temp: [] })
}

export default function Hourly({ hourly, units, selectedDayIndex, daily, onSelectDay }) {
  const [showDayMenu, setShowDayMenu] = useState(false)
  const [localSelectedDay, setLocalSelectedDay] = useState(selectedDayIndex)

  useEffect(() => {
    setLocalSelectedDay(selectedDayIndex)
  }, [selectedDayIndex])

  const groups = groupHoursByDay(hourly, daily)
  const group = groups[localSelectedDay] || { time: [], temp: [] }

  const dayName = new Date(daily.time[localSelectedDay]).toLocaleDateString('en-US', { weekday: 'long' })

  const handleSelectDay = (dayIndex) => {
    setLocalSelectedDay(dayIndex)
    onSelectDay(dayIndex)
    setShowDayMenu(false)
  }

  return (
    <div className="bg-slate-800 rounded-3xl p-8 h-fit sticky top-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Hourly forecast</h3>
        <div className="relative">
          <button
            onClick={() => setShowDayMenu(!showDayMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition font-medium"
          >
            {dayName}
            <img src={assets.dropdown} alt="Dropdown" className="w-4 h-4" />
          </button>
          {showDayMenu && (
            <div className="absolute top-full right-0 bg-slate-700 rounded-lg mt-2 w-48 z-10 shadow-lg">
              {daily.time.slice(0, 7).map((d, i) => (
                <button
                  key={d}
                  onClick={() => handleSelectDay(i)}
                  className={`w-full text-left px-4 py-3 first:rounded-t-lg last:rounded-b-lg text-sm transition ${
                    localSelectedDay === i ? 'bg-slate-600 font-semibold' : 'hover:bg-slate-600'
                  }`}
                >
                  {new Date(d).toLocaleDateString('en-US', { weekday: 'long' })}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {group.time.slice(0, 24).map((t, i) => {
          const hour = new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
          const temp = units === 'metric'
            ? Math.round(group.temp[i])
            : Math.round((group.temp[i] * 9/5) + 32)

          return (
            <div key={t} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
              <div className="flex items-center gap-4">
                <img src={assets.partly} alt="Weather" className="w-6 h-6" />
                <span className="text-base font-medium">{hour}</span>
              </div>
              <span className="font-bold text-lg">{temp}°</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}