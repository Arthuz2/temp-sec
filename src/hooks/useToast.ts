import { useState, useCallback } from "react"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast["type"] = "info", duration = 4000) => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type, duration }

    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
  }
}
