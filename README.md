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

jest.mock("@pachun/use-expo-push-notifications", () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe("receiving push notifications", () => {
  it("displays text received in notifications", async () => {
    // capture your notification handler before you render
    let sendNotification
    jest
      .mocked(useExpoPushNotifications)
      .mockImplementation(({ onNotificationReceived }) => {
        sendNotification = onNotificationReceived
      })

    renderRouter("src/app", { initialUrl: "/" })

    // call your actual notification handler
    sendNotification!({
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

This will allow you to test the actual behavior of your app when receiving notifications.

You can test how it will handle receiving notifications on different screens by rendering the router at different routes.

You can do the same for testing notification interactions, like tapping a notification, or long pressing one to bring up the notification actions menu.

You can log the interaction if you don't know what it will look like in your handler, and then write a test for that format of message and what you'd like to happen when it's received.

## Contributing

PRs are exciting 🤟 Bump the version number in `package.json` and open one.

- Please do not submit AI generated pull requests.
- Please keep coverage at or above where it is when you clone the repo (`yarn test --collectCoverage`).
