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

  const lastNotificationResponse = Notifications.useLastNotificationResponse()

  React.useEffect(() => {
    receivedNotificationWhenTheAppIsOpenListener.current =
      Notifications.addNotificationReceivedListener(onNotificationReceived)

    notificationTappedWhenTheAppIsClosedListener.current =
      Notifications.addNotificationResponseReceivedListener(
        notificationResponse => {
          if (
            notificationResponse.notification.request.identifier !==
            // sometimes this callback is triggered for notifications that
            // have already been sent to this callback (tapped).
            // In those cases, we do not trigger our callback.
            lastNotificationResponse?.notification.request.identifier
          ) {
            onNotificationInteraction(notificationResponse)
          }
        },
      )

    return () => {
      receivedNotificationWhenTheAppIsOpenListener.current?.remove()
      notificationTappedWhenTheAppIsClosedListener.current?.remove()
    }
  }, [
    onNotificationReceived,
    onNotificationInteraction,
    lastNotificationResponse,
  ])
}

export default useExpoPushNotifications
