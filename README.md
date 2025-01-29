[![npm version](https://img.shields.io/npm/v/@pachun/use-expo-push-notifications.svg)](https://www.npmjs.com/package/@pachun/use-expo-push-notifications)
[![cov](https://pachun.github.io/use-expo-push-notifications/badges/coverage.svg)](https://github.com/pachun/use-expo-push-notifications/actions)

# useExpoPushNotifications

```
yarn add @pachun/use-expo-push-notifications
```

```ts
import React from "react"
import * as Notifications from "expo-notifications"
import useExpoPushNotifications from "@pachun/use-expo-push-notifications"

const App = () => {
  useExpoPushNotifications({
    onNotificationReceived: React.useCallback(
      (notification: Notifications.Notification) => {
        console.log(
          "Notification received",
          JSON.stringify(notification, null, 2),
        )
      },
      [],
    ),
    onNotificationInteraction: React.useCallback(
      (notificationResponse: Notifications.NotificationResponse) => {
        console.log(
          "Notification interaction",
          JSON.stringify(notificationResponse, null, 2),
        )
      },
      [],
    ),
  })

  return <></>
}
```

## Motivation

When you want to test the behavior of your app rather than [useEffect and useRef implementations](https://github.com/pachun/use-expo-push-notifications/blob/main/src/index.ts), this can be helpful.

```typescript
import { renderRouter, screen, waitFor } from "expo-router/testing-library"
import expoPushNotificationsSimulator from "tests/helpers/expo-push-notifications-simulator"

describe("receiving push notifications", () => {
  it("displays text received in notifications", async () => {
    renderRouter("src/app", { initialUrl: "/" })

    expoPushNotificationsSimulator.sendNotification({
      request: {
        content: {
          data: {
            text_received_in_notifications: "Hello, world!",
          },
        },
      },
    })

    await waitFor(async () => {
      expect(screen.getByText("Hello, world!")).toBeTruthy()
    })
  })
})
```

Youll need to create that test helper yourself:

```typescript
import * as Notifications from "expo-notifications"
import useExpoPushNotifications from "@pachun/use-expo-push-notifications"
import { DeepPartial } from "src/types/DeepPartial"

jest.mock("@pachun/use-expo-push-notifications", () => ({
  __esModule: true,
  default: jest.fn(),
}))

const mockFunction = (thing: any) => thing as unknown as jest.Mock

const expoPushNotificationsSimulator = (() => {
  let sendNotification:
    | ((notification: DeepPartial<Notifications.Notification>) => void)
    | undefined
  let sendNotificationInteraction:
    | ((notification: DeepPartial<Notifications.NotificationResponse>) => void)
    | undefined

  mockFunction(useExpoPushNotifications).mockImplementation(
    ({ onNotificationReceived, onNotificationInteraction }) => {
      sendNotification = onNotificationReceived
      sendNotificationInteraction = onNotificationInteraction
    },
  )

  return {
    get sendNotification() {
      if (!sendNotification) {
        throw new Error(
          "onNotificationReceived is not yet assigned. Ensure the component using useExpoPushNotifications has rendered.",
        )
      }
      return sendNotification
    },
    get sendNotificationInteraction() {
      if (!sendNotificationInteraction) {
        throw new Error(
          "onNotificationInteraction is not yet assigned. Ensure the component using useExpoPushNotifications has rendered.",
        )
      }
      return sendNotificationInteraction
    },
  }
})()

export default expoPushNotificationsSimulator
```

## Contributing

PRs are exciting 🤟 Bump the version number in `package.json` and open one.

- Please do not submit AI generated pull requests.
- Please keep coverage at or above where it is when you clone the repo (`yarn test --collectCoverage`).
