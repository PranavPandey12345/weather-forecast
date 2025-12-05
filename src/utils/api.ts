import { useQuery, UseQueryResult } from '@tanstack/react-query'

interface GeocodingResult {
  latitude: number
  longitude: number
  name: string
  country: string
}

interface WeatherDataResponse {
  current_weather: {
    temperature: number
    windspeed: number
    relativehumidity: number
    weathercode: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    relativehumidity_2m: number[]
    windspeed_10m: number[]
    precipitation: number[]
  }
  daily: {
    time: string[]
    weathercode: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_sum: number[]
  }
  timezone: string
}

export async function geocode(name: string): Promise<GeocodingResult[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=5&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding failed')
  const json = await res.json()
  return json.results || []
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherDataResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current_weather: 'true',
    hourly: ['temperature_2m', 'relativehumidity_2m', 'windspeed_10m', 'precipitation'].join(','),
    daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min', 'precipitation_sum'].join(','),
    timezone: 'auto'
  })
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather fetch failed')
  return await res.json()
}

// React Query hook for fetching weather
export function useWeatherData(
  latitude: number | null,
  longitude: number | null
): UseQueryResult<WeatherDataResponse, Error> {
  return useQuery({
    queryKey: ['weather', latitude, longitude],
    queryFn: () => {
      if (!latitude || !longitude) throw new Error('Coordinates required')
      return fetchWeatherData(latitude, longitude)
    },
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  })
}