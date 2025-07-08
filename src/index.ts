import React from "react"
import * as Notifications from "expo-notifications"
import { EventSubscription } from "expo-modules-core"
import { useSegments } from "expo-router"

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

  const segments = useSegments()
  const [pendingInteraction, setPendingInteraction] =
    React.useState<Notifications.NotificationResponse | null>(null)
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
            setPendingInteraction(notificationResponse)
          }
        },
      )

    return () => {
      receivedNotificationWhenTheAppIsOpenListener.current?.remove()
      notificationTappedWhenTheAppIsClosedListener.current?.remove()
    }
  }, [onNotificationReceived, lastNotificationResponse])

  // Wait until router is ready before firing the interaction callback
  // On cold starts, it's not ready until the router has segments
  React.useEffect(() => {
    if (pendingInteraction && segments.length > 0) {
      onNotificationInteraction(pendingInteraction)
      setPendingInteraction(null)
    }
  }, [pendingInteraction, segments, onNotificationInteraction])
}

export default useExpoPushNotifications
