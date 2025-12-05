import './App.css'
import React, { useState, useEffect } from 'react'
import { assets } from './assets/assets'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import Hourly from './components/Hourly'
import { geocode, useWeatherData } from './utils/api'

interface Coordinates {
  latitude: number
  longitude: number
  name: string
  country: string
}

interface CurrentWeather {
  temperature: number
  windspeed: number
  relativehumidity: number
  weathercode: number
}

interface GeocodingSuggestion {
  latitude: number
  longitude: number
  name: string
  country: string
}

function App() {
  const [query, setQuery] = useState<string>('Berlin')
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric')
  const [coords, setCoords] = useState<Coordinates | null>(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
  const [searchSuggestions, setSearchSuggestions] = useState<GeocodingSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)

  // Use React Query hook for fetching weather
  const { data, isLoading: loading, isError, error: queryError } = useWeatherData(
    coords?.latitude ?? null,
    coords?.longitude ?? null
  )

  // Derive error from React Query
  const apiError: string | null = isError && queryError
    ? (queryError instanceof Error ? queryError.message : 'Failed to fetch weather')
    : null

  // Effect: when `query` changes, perform geocoding and update coords
  useEffect(() => {
    let mounted: boolean = true

    const doSearch = async (): Promise<void> => {
      // Reset any previous local error before starting
      if (mounted) setError(null)

      try {
        const matches = await geocode(query)
        if (!matches || matches.length === 0) {
          if (!mounted) return
          setError('No search result found!')
          return
        }
        const { latitude, longitude, name, country } = matches[0]
        if (!mounted) return
        setCoords({ latitude, longitude, name, country })
        setSelectedDayIndex(0)
      } catch {
        if (!mounted) return
        setError('Something went wrong')
      }
    }

    // Run the async search
    doSearch()

    return () => {
      mounted = false
    }
  }, [query])

  // Combine local error and API error for display
  const displayError: string | null = error ?? apiError

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="px-6 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={assets.logo} alt="Weather Now" className="w-70 h-70" />
          </div>
          {/* Units Section in Header */}
          <div className="ml-auto">
            <SearchBar
              query={query}
              onSearch={setQuery}
              units={units}
              setUnits={setUnits}
              suggestions={searchSuggestions}
              onSuggestionsChange={setSearchSuggestions}
              headerMode={true}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold mb-12 text-center">How's the sky looking today?</h1>

          {/* Search Bar Below Heading */}
          <div className="max-w-3xl mx-auto mb-12 px-4">
            <SearchBar
              query={query}
              onSearch={setQuery}
              units={units}
              setUnits={setUnits}
              suggestions={searchSuggestions}
              onSuggestionsChange={setSearchSuggestions}
              headerMode={false}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <img src={assets.loading} alt="Loading" className="w-16 h-16 animate-spin mb-6" />
              <p className="text-gray-400 text-lg">Search in progress</p>
            </div>
          )}

          {/* Error State */}
          {displayError && !loading && (
            <div className="flex flex-col items-center justify-center py-32">
              <img src={assets.error} alt="Error" className="w-16 h-16 mb-6" />
              <p className="text-2xl font-semibold mb-6">{displayError}</p>
              {displayError === 'Something went wrong' && (
                <button
                  onClick={() => setQuery('Berlin')}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-lg"
                >
                  <img src={assets.retry} alt="Retry" className="w-5 h-5" />
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Weather Content */}
          {!loading && data && coords && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column - 3 cols */}
              <div className="lg:col-span-3 space-y-8">
                {/* Current Weather */}
                <CurrentWeather
                  current={data.current_weather}
                  location={coords}
                  units={units}
                  daily={data.daily}
                />

                {/* Weather Details */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <WeatherMetric label="Feels Like" value={`${Math.round(data.current_weather.temperature)}°`} />
                  <WeatherMetric label="Humidity" value={`${data.current_weather.relativehumidity || 46}%`} />
                  <WeatherMetric label="Wind" value={`${Math.round(data.current_weather.windspeed)} ${units === 'metric' ? 'km/h' : 'mph'}`} />
                  <WeatherMetric label="Precipitation" value={`${data.daily.precipitation_sum?.[0] || 0} ${units === 'metric' ? 'mm' : 'in'}`} />
                </div>

                {/* Daily Forecast */}
                <Forecast
                  daily={data.daily}
                  units={units}
                  onSelectDay={setSelectedDayIndex}
                  selectedIndex={selectedDayIndex}
                />
              </div>

              {/* Right Column - Hourly - 1 col */}
              <div className="lg:col-span-1">
                <Hourly
                  hourly={data.hourly}
                  units={units}
                  selectedDayIndex={selectedDayIndex}
                  daily={data.daily}
                  onSelectDay={setSelectedDayIndex}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

interface WeatherMetricProps {
  label: string
  value: string
}

function WeatherMetric({ label, value }: WeatherMetricProps) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition">
      <p className="text-gray-400 text-sm mb-3 font-medium">{label}</p>
      <p className="text-3xl lg:text-4xl font-bold">{value}</p>
    </div>
  )
}

export default App
