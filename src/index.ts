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
    /* c8 ignore start */
    if (receivedNotificationWhenTheAppIsOpenListener.current) {
      Notifications.removeNotificationSubscription(
        receivedNotificationWhenTheAppIsOpenListener.current,
      )
    }
    if (notificationTappedWhenTheAppIsClosedListener.current) {
      Notifications.removeNotificationSubscription(
        notificationTappedWhenTheAppIsClosedListener.current,
      )
    }
    /* c8 ignore stop */

    receivedNotificationWhenTheAppIsOpenListener.current =
      Notifications.addNotificationReceivedListener(onNotificationReceived)

    notificationTappedWhenTheAppIsClosedListener.current =
      Notifications.addNotificationResponseReceivedListener(
        onNotificationInteraction,
      )

    return () => {
      if (receivedNotificationWhenTheAppIsOpenListener.current) {
        Notifications.removeNotificationSubscription(
          receivedNotificationWhenTheAppIsOpenListener.current,
        )
      }
      if (notificationTappedWhenTheAppIsClosedListener.current) {
        Notifications.removeNotificationSubscription(
          notificationTappedWhenTheAppIsClosedListener.current,
        )
      }
    }
  }, [onNotificationReceived, onNotificationInteraction])
}

export default useExpoPushNotifications
