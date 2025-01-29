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

I made this because testing ref code sucks. With `useExpoPushNotifications`, you can focus on testing the behavior of your notification handling rather than ref code implementation.

... post an example here, please, nick ...

## Contributing

PRs are exciting 🤟 Bump the version number in `package.json` and open one.

- Please do not submit AI generated pull requests.
- Please keep coverage at or above where it is when you clone the repo (`yarn test --collectCoverage`).
