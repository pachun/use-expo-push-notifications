import React from "react"
import * as Notifications from "expo-notifications"
import { EventSubscription } from "expo-modules-core"

const useExpoPushNotifications = ({
  onNotificationReceived,
  onNotificationInteraction,
}: {
  onNotificationReceived: (notification: Notifications.Notification) => void
  onNotificationInteraction: (
    notificationResponse: Notifications.NotificationResponse,
  ) => void
}) => {
  const receivedNotificationWhenTheAppIsOpenListener =
    React.useRef<EventSubscription | null>(null)
  const notificationTappedWhenTheAppIsClosedListener =
    React.useRef<EventSubscription | null>(null)

  React.useEffect(() => {
    receivedNotificationWhenTheAppIsOpenListener.current =
      Notifications.addNotificationReceivedListener(onNotificationReceived)

    notificationTappedWhenTheAppIsClosedListener.current =
      Notifications.addNotificationResponseReceivedListener(
        onNotificationInteraction,
      )

    return () => {
      receivedNotificationWhenTheAppIsOpenListener.current?.remove()
      notificationTappedWhenTheAppIsClosedListener.current?.remove()
    }
  }, [onNotificationReceived, onNotificationInteraction])
}

export default useExpoPushNotifications
