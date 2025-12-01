import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { geocode } from '../utils/api'

export default function SearchBar({ query, onSearch, units, setUnits, suggestions, onSuggestionsChange }) {
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

  return (
    <div className="flex flex-col lg:flex-row items-center gap-3 w-full lg:w-auto">
      {/* Search Bar */}
      <form onSubmit={submit} className="relative w-full lg:w-auto order-2 lg:order-1">
        <div className="flex flex-col lg:flex-row gap-2 w-full">
          <div className="relative flex-1 lg:flex-none">
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="Search for a place..."
              className="w-full lg:w-80 px-4 py-2 bg-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full lg:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Units Dropdown */}
      <div className="relative order-1 lg:order-2">
        <button
          onClick={() => setShowUnitsMenu(!showUnitsMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition w-full lg:w-auto justify-center lg:justify-start"
        >
          <img src={assets.units} alt="Units" className="w-4 h-4" />
          Units
          <img src={assets.dropdown} alt="Dropdown" className="w-4 h-4" />
        </button>

        {showUnitsMenu && (
          <div className="absolute top-full right-0 bg-slate-700 rounded-lg mt-2 w-48 z-10 shadow-lg">
            <div className="p-3">
              <p className="text-sm text-gray-400 mb-2">Switch to Imperial</p>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="temp"
                  checked={units === 'metric'}
                  onChange={() => { setUnits('metric'); setShowUnitsMenu(false) }}
                  className="w-4 h-4"
                />
                <span className="text-sm">Celsius (°C)</span>
                {units === 'metric' && <img src={assets.checkmark} alt="Selected" className="w-4 h-4 ml-auto" />}
              </label>
              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                <input
                  type="radio"
                  name="temp"
                  checked={units === 'imperial'}
                  onChange={() => { setUnits('imperial'); setShowUnitsMenu(false) }}
                  className="w-4 h-4"
                />
                <span className="text-sm">Fahrenheit (°F)</span>
                {units === 'imperial' && <img src={assets.checkmark} alt="Selected" className="w-4 h-4 ml-auto" />}
              </label>

              <p className="text-sm text-gray-400 mb-2">Wind Speed</p>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="radio" name="wind" defaultChecked className="w-4 h-4" />
                <span className="text-sm">km/h</span>
                <img src={assets.checkmark} alt="Selected" className="w-4 h-4 ml-auto" />
              </label>
              <label className="flex items-center gap-2 mb-3 cursor-pointer">
                <input type="radio" name="wind" className="w-4 h-4" />
                <span className="text-sm">mph</span>
              </label>

              <p className="text-sm text-gray-400 mb-2">Precipitation</p>
              <label className="flex items-center gap-2 mb-2 cursor-pointer">
                <input type="radio" name="precip" defaultChecked className="w-4 h-4" />
                <span className="text-sm">Millimetres (mm)</span>
                <img src={assets.checkmark} alt="Selected" className="w-4 h-4 ml-auto" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="precip" className="w-4 h-4" />
                <span className="text-sm">Inches (in)</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}