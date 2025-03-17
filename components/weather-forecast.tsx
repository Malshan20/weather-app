"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useInView } from "react-intersection-observer"

interface ForecastDay {
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
}

interface WeatherForecastProps {
  forecast: ForecastDay[]
}

export default function WeatherForecast({ forecast }: WeatherForecastProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date)
  }

  const getFormattedDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
  }

  return (
    <div ref={ref} className="mt-8">
      <h3 className="text-2xl font-bold mb-4">3-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-md h-full">
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="text-xl font-bold">{getDayName(day.date)}</h4>
                  <p className="text-sm opacity-80">{getFormattedDate(day.date)}</p>

                  <div className="my-4 flex justify-center">
                    <img
                      src={day.day.condition.icon || "/placeholder.svg"}
                      alt={day.day.condition.text}
                      className="w-16 h-16"
                    />
                  </div>

                  <p className="text-sm mb-2">{day.day.condition.text}</p>

                  <div className="flex justify-center items-center space-x-4">
                    <span className="text-xl font-bold">{Math.round(day.day.maxtemp_c)}°</span>
                    <span className="text-sm opacity-80">{Math.round(day.day.mintemp_c)}°</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/5 p-2 rounded">
                      <p className="opacity-80">Sunrise</p>
                      <p>{day.astro.sunrise}</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded">
                      <p className="opacity-80">Sunset</p>
                      <p>{day.astro.sunset}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

