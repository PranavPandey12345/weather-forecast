import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { geocode } from '../utils/api'

export default function SearchBar({ query, onSearch, units, setUnits, suggestions, onSuggestionsChange, headerMode = false }) {
  const [value, setValue] = useState(query)
  const [showUnitsMenu, setShowUnitsMenu] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleInputChange = async (e) => {
    const val = e.target.value
    setValue(val)
    if (val.length > 2) {
      const results = await geocode(val)
      onSuggestionsChange(results?.slice(0, 4) || [])
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      onSearch(value.trim())
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (name) => {
    setValue(name)
    onSearch(name)
    setShowSuggestions(false)
  }

  // Header mode - only show units with new design
  if (headerMode) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUnitsMenu(!showUnitsMenu)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-white rounded-lg hover:border-gray-300 transition"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          Units
          <img src={assets.dropdown} alt="Dropdown" className="w-3 h-3" />
        </button>

        {showUnitsMenu && (
          <div className="absolute top-full right-0 bg-slate-800 rounded-lg mt-2 w-64 z-50 shadow-lg p-4 border border-gray-600">
            {/* Switch to Imperial */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setUnits(units === 'metric' ? 'imperial' : 'metric')
                  setShowUnitsMenu(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-slate-700 rounded transition"
              >
                Switch to {units === 'metric' ? 'Imperial' : 'Metric'}
              </button>
            </div>

            <hr className="border-gray-600 my-3" />

            {/* Temperature */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 font-semibold mb-3 uppercase">Temperature</p>
              <label className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                <input
                  type="radio"
                  name="temp"
                  checked={units === 'metric'}
                  onChange={() => {
                    setUnits('metric')
                    setShowUnitsMenu(false)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">Celsius (°C)</span>
                {units === 'metric' && <span className="text-blue-400">✓</span>}
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                <input
                  type="radio"
                  name="temp"
                  checked={units === 'imperial'}
                  onChange={() => {
                    setUnits('imperial')
                    setShowUnitsMenu(false)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">Fahrenheit (°F)</span>
                {units === 'imperial' && <span className="text-blue-400">✓</span>}
              </label>
            </div>

            <hr className="border-gray-600 my-3" />

            {/* Wind Speed */}
            <div className="mb-4">
              <p className="text-xs text-gray-400 font-semibold mb-3 uppercase">Wind Speed</p>
              <label className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                <input
                  type="radio"
                  name="wind"
                  checked={units === 'metric'}
                  onChange={() => {
                    setUnits('metric')
                    setShowUnitsMenu(false)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">km/h</span>
                {units === 'metric' && <span className="text-blue-400">✓</span>}
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                <input
                  type="radio"
                  name="wind"
                  checked={units === 'imperial'}
                  onChange={() => {
                    setUnits('imperial')
                    setShowUnitsMenu(false)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">mph</span>
                {units === 'imperial' && <span className="text-blue-400">✓</span>}
              </label>
            </div>

            <hr className="border-gray-600 my-3" />

            {/* Precipitation */}
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-3 uppercase">Precipitation</p>
              <label className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                <input
                  type="radio"
                  name="precip"
                  checked={units === 'metric'}
                  onChange={() => {
                    setUnits('metric')
                    setShowUnitsMenu(false)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">Millimeters (mm)</span>
                {units === 'metric' && <span className="text-blue-400">✓</span>}
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                <input
                  type="radio"
                  name="precip"
                  checked={units === 'imperial'}
                  onChange={() => {
                    setUnits('imperial')
                    setShowUnitsMenu(false)
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm flex-1">Inches (in)</span>
                {units === 'imperial' && <span className="text-blue-400">✓</span>}
              </label>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Main search mode - show search input
  return (
    <div className="flex flex-col gap-3 w-full">
      <form onSubmit={submit} className="relative w-full">
        <div className="flex flex-col lg:flex-row gap-2 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="Search for a place..."
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <img src={assets.search} alt="Search" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-slate-700 rounded-lg mt-1 z-10">
                {suggestions.map((s) => (
                  <button
                    key={`${s.name}-${s.country}`}
                    type="button"
                    onClick={() => selectSuggestion(s.name)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-600 first:rounded-t-lg last:rounded-b-lg text-sm"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full lg:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}