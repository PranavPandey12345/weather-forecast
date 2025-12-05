import { assets } from '../assets/assets'

function weatherCodeToIcon(code: number): string {
  if (code === 0) return assets.sunny
  if (code <= 3) return assets.partly
  if (code <= 48) return assets.fog
  if (code <= 67) return assets.drizzle
  if (code <= 77) return assets.snow
  if (code <= 88) return assets.rain
  if (code <= 99) return assets.storm
  return assets.sunny
}

function weatherCodeToText(code: number): string {
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Fog'
  if (code <= 67) return 'Drizzle'
  if (code <= 77) return 'Snow'
  if (code <= 88) return 'Rain'
  if (code <= 99) return 'Thunderstorm'
  return 'Clear'
}

interface CurrentWeatherProps {
  current: {
    temperature: number
    windspeed: number
    relativehumidity: number
    weathercode: number
  }
  location: {
    name: string
    country: string
  }
  units: 'metric' | 'imperial'
  daily: {
    time: string[]
    weathercode: number[]
  }
}

export default function CurrentWeather({
  current,
  location,
  units,
  daily
}: CurrentWeatherProps) {
  const temp = units === 'metric'
    ? Math.round(current.temperature)
    : Math.round((current.temperature * 9 / 5) + 32)

  const code = daily.weathercode[0]
  const bgImage = window.innerWidth >= 1024 ? assets.bgTodayLarge : assets.bgTodaySmall

  return (
    <div
      className="relative bg-cover bg-center rounded-3xl p-9 lg:p-0 text-white overflow-hidden"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 ml-5">
        <div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-3">
            {location.name}, {location.country}
          </h2>
          <p className="text-lg lg:text-xl opacity-90 mb-4">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          <p className="text-xl lg:text-2xl">{weatherCodeToText(code)}</p>
        </div>
        <div className="flex flex-col items-center gap-6">
          <img src={weatherCodeToIcon(code)} alt="Weather" className="w-32 h-32 lg:w-40 lg:h-40" />
          <div className="text-center">
            <div className="text-6xl lg:text-8xl font-bold">{temp}°</div>
            <p className="text-sm lg:text-base opacity-75 mt-2">
              {units === 'metric' ? 'Celsius' : 'Fahrenheit'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}