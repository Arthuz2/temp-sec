import { View, Text, TouchableOpacity, Animated } from "react-native"
import { useEffect, useRef } from "react"
import { Ionicons } from "@expo/vector-icons"
import type { Toast } from "../../hooks/useToast"
import styles from "./styles"

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const slideAnim = useRef(new Animated.Value(-100)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove(toast.id)
    })
  }

  const getToastStyle = () => {
    switch (toast.type) {
      case "success":
        return styles.successToast
      case "error":
        return styles.errorToast
      case "warning":
        return styles.warningToast
      default:
        return styles.infoToast
    }
  }

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "checkmark-circle"
      case "error":
        return "alert-circle"
      case "warning":
        return "warning"
      default:
        return "information-circle"
    }
  }

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyle(),
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.toastContent}>
        <Ionicons name={getIcon()} size={20} color="white" style={styles.toastIcon} />
        <Text style={styles.toastMessage} numberOfLines={2}>
          {toast.message}
        </Text>
        <TouchableOpacity onPress={handleRemove} style={styles.closeButton}>
          <Ionicons name="close" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemoveToast: (id: string) => void
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <View style={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemoveToast} />
      ))}
    </View>
  )
}
