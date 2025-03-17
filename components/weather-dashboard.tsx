"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Droplets, Wind, Sunrise, Sunset } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import WeatherForecast from "./weather-forecast"
import WeatherAnimation from "./weather-animation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface WeatherData {
  location: {
    name: string
    region: string
    country: string
    localtime: string
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_kph: number
    wind_dir: string
    humidity: number
    feelslike_c: number
    uv: number
    is_day: number
  }
  forecast?: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          icon: string
          code: number
        }
      }
      astro: {
        sunrise: string
        sunset: string
      }
      hour: Array<{
        time: string
        temp_c: number
        condition: {
          text: string
          icon: string
          code: number
        }
        chance_of_rain: number
      }>
    }>
  }
}

export default function WeatherDashboard() {
  const [location, setLocation] = useState("London")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const { toast } = useToast()

  const fetchWeather = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHERAPI_KEY}&q=${query}&days=3&aqi=no&alerts=no`,
      )

      if (!response.ok) {
        throw new Error("Location not found")
      }

      const data = await response.json()
      setWeatherData(data)
      setLocation(data.location.name)
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not find that location. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeather(searchInput)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeather(`${latitude},${longitude}`)
        },
        () => {
          toast({
            title: "Error",
            description: "Unable to get your location. Please allow location access or search manually.",
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
    }
  }

  // Real-time updates every 5 minutes
  useEffect(() => {
    fetchWeather(location)

    const interval = setInterval(
      () => {
        fetchWeather(location)
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [])

  // Get time of day to adjust background
  const getTimeBasedClass = () => {
    if (!weatherData) return "from-sky-900 to-indigo-900"

    const isDay = weatherData.current.is_day
    const condition = weatherData.current.condition.code

    if (isDay) {
      // Day time conditions
      if (condition >= 1000 && condition < 1030) {
        return "from-sky-400 to-blue-500" // Clear or partly cloudy
      } else if (condition >= 1030 && condition < 1100) {
        return "from-gray-400 to-gray-600" // Cloudy/foggy
      } else if (condition >= 1100 && condition < 1200) {
        return "from-blue-400 to-blue-600" // Light rain
      } else if (condition >= 1200 && condition < 1300) {
        return "from-blue-600 to-blue-800" // Heavy rain
      } else {
        return "from-indigo-400 to-indigo-600" // Snow or other
      }
    } else {
      // Night time
      return "from-slate-900 to-blue-950"
    }
  }

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-b ${getTimeBasedClass()} text-white transition-colors duration-1000 ease-in-out`}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-white drop-shadow-lg">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-cyan-200">
              Weather Forecast
            </span>
          </h1>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleUseCurrentLocation}
              className="border-white/20 text-black hover:bg-white/10"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </form>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="animate-pulse text-xl">Loading weather data...</div>
            </motion.div>
          ) : weatherData ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Weather Card */}
                <Card className="col-span-1 lg:col-span-2 bg-white/10 border-white/20 backdrop-blur-md overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                      <div className="text-center md:text-left mb-4 md:mb-0">
                        <h2 className="text-3xl font-bold">{weatherData.location.name}</h2>
                        <p className="text-sm opacity-80">
                          {weatherData.location.region}, {weatherData.location.country}
                        </p>
                        <p className="text-sm opacity-80">
                          {new Date(weatherData.location.localtime).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <WeatherAnimation
                          conditionCode={weatherData.current.condition.code}
                          isDay={weatherData.current.is_day === 1}
                          className="w-24 h-24"
                        />
                        <div className="text-center">
                          <div className="text-5xl font-bold">{Math.round(weatherData.current.temp_c)}°C</div>
                          <div className="text-lg">{weatherData.current.condition.text}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <div className="bg-white/5 p-3 rounded-lg flex flex-col items-center">
                        <Droplets className="h-6 w-6 mb-2 text-blue-300" />
                        <span className="text-sm opacity-80">Humidity</span>
                        <span className="text-lg font-semibold">{weatherData.current.humidity}%</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg flex flex-col items-center">
                        <Wind className="h-6 w-6 mb-2 text-blue-300" />
                        <span className="text-sm opacity-80">Wind</span>
                        <span className="text-lg font-semibold">{weatherData.current.wind_kph} km/h</span>
                      </div>
                      {weatherData.forecast && (
                        <>
                          <div className="bg-white/5 p-3 rounded-lg flex flex-col items-center">
                            <Sunrise className="h-6 w-6 mb-2 text-yellow-300" />
                            <span className="text-sm opacity-80">Sunrise</span>
                            <span className="text-lg font-semibold">
                              {weatherData.forecast.forecastday[0].astro.sunrise}
                            </span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg flex flex-col items-center">
                            <Sunset className="h-6 w-6 mb-2 text-orange-300" />
                            <span className="text-sm opacity-80">Sunset</span>
                            <span className="text-lg font-semibold">
                              {weatherData.forecast.forecastday[0].astro.sunset}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Hourly Forecast Card */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Today's Forecast</h3>
                    {weatherData.forecast && (
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {weatherData.forecast.forecastday[0].hour
                          .filter((_, index) => index % 2 === 0) // Show every other hour to save space
                          .map((hour, index) => {
                            const hourTime = new Date(hour.time)
                            const isNow = new Date().getHours() === hourTime.getHours()

                            return (
                              <motion.div
                                key={hour.time}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center justify-between p-2 rounded-lg ${isNow ? "bg-white/20" : "bg-white/5"}`}
                              >
                                <div className="flex items-center">
                                  <div className="w-12 text-sm">
                                    {hourTime.getHours().toString().padStart(2, "0")}:00
                                  </div>
                                  <img
                                    src={hour.condition.icon || "/placeholder.svg"}
                                    alt={hour.condition.text}
                                    className="w-10 h-10"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <div className="text-sm mr-2">
                                    {hour.chance_of_rain > 0 && (
                                      <span className="text-blue-300">{hour.chance_of_rain}%</span>
                                    )}
                                  </div>
                                  <div className="text-lg font-semibold">{Math.round(hour.temp_c)}°</div>
                                </div>
                              </motion.div>
                            )
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 3-Day Forecast */}
              {weatherData.forecast && <WeatherForecast forecast={weatherData.forecast.forecastday} />}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p>Search for a location to see the weather forecast.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

