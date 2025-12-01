// small helper: geocode via Open-Meteo geocoding, then forecast
export async function geocode(name: string) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    name
  )}&count=5&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Geocoding failed')
  const json = await res.json()
  return json.results || []
}

export async function fetchWeather(latitude: number, longitude: number) {
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