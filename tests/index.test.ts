import * as Notifications from "expo-notifications"
import useExpoPushNotifications from "../src/index"
import { waitFor } from "@testing-library/react-native"
import { act, renderHook } from "@testing-library/react-hooks"

describe("useExpoPushNotifications({ onNotificationReceived, onNotificationInteraction })", () => {
  it("responds to notifications", async () => {
    const onNotificationReceived = jest.fn()
    const onNotificationReceivedReturnedRemoveFunction = jest.fn()
    const onNotificationReceivedReturnValue = {
      remove: onNotificationReceivedReturnedRemoveFunction,
    }
    const onNotificationInteraction = jest.fn()
    const onNotificationInteractionReturnedRemoveFunction = jest.fn()
    const onNotificationInteractionReturnValue = {
      remove: onNotificationInteractionReturnedRemoveFunction,
    }

    jest
      .spyOn(Notifications, "addNotificationReceivedListener")
      .mockImplementation(
        (listener: (event: Notifications.Notification) => void) => {
          if (listener !== onNotificationReceived) {
            throw new Error("Unexpected callback")
          }
          return onNotificationReceivedReturnValue
        },
      )
    jest
      .spyOn(Notifications, "addNotificationResponseReceivedListener")
      .mockImplementation(
        (listener: (event: Notifications.NotificationResponse) => void) => {
          if (listener !== onNotificationInteraction) {
            throw new Error("Unexpected callback")
          }
          return onNotificationInteractionReturnValue
        },
      )

    const { unmount } = renderHook(() =>
      useExpoPushNotifications({
        onNotificationReceived,
        onNotificationInteraction,
      }),
    )

    await waitFor(() =>
      expect(
        Notifications.addNotificationReceivedListener,
      ).toHaveBeenCalledWith(onNotificationReceived),
    )

    await waitFor(() =>
      expect(
        Notifications.addNotificationResponseReceivedListener,
      ).toHaveBeenCalledWith(onNotificationInteraction),
    )

    act(() => {
      unmount()
    })

    await waitFor(() =>
      expect(onNotificationReceivedReturnedRemoveFunction).toHaveBeenCalled(),
    )

    await waitFor(() =>
      expect(
        onNotificationInteractionReturnedRemoveFunction,
      ).toHaveBeenCalled(),
    )

    expect(true).toBe(true)
  })
})
