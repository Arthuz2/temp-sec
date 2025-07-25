import { useEffect, useRef } from "react"
import { useNotifications } from "./useNotifications"
import { useToast } from "./useToast"

interface Temperature {
  data: string
  valor: number
}

export function useTemperatureDetection(currentTemp?: Temperature, allTemperatures?: Temperature[]) {
  const { sendLocalNotification } = useNotifications()
  const { showToast } = useToast()
  const previousTempRef = useRef<Temperature | null>(null)
  const previousCountRef = useRef<number>(0)

  useEffect(() => {
    if (currentTemp && previousTempRef.current) {
      const currentTime = new Date(currentTemp.data).getTime()
      const previousTime = new Date(previousTempRef.current.data).getTime()

      if (currentTime !== previousTime) {
        handleNewTemperature(currentTemp)
      }
    }

    previousTempRef.current = currentTemp || null
  }, [currentTemp])

  const handleNewTemperature = async (temperature: Temperature) => {
    try {
      await sendLocalNotification(temperature)

      const temperatureValue = temperature.valor
      const timeAgo = new Date(temperature.data).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })

      let message = `Nova temperatura: ${temperatureValue}°C (${timeAgo})`
      let type: "success" | "warning" | "error" = "success"

      if (temperatureValue >= 35) {
        message = `🔥 Temperatura alta: ${temperatureValue}°C (${timeAgo})`
        type = "error"
      } else if (temperatureValue <= 10) {
        message = `❄️ Temperatura baixa: ${temperatureValue}°C (${timeAgo})`
        type = "warning"
      }

      showToast(message, type)
    } catch (error) {
      console.error("Erro ao enviar notificação:", error)
    }
  }
}
