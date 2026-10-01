# BizExpense Mobile

Expo client for the existing BizExpense FastAPI backend, with receipt OCR review and RevenueCat-powered Pro access.

## Setup

1. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to a URL reachable from the device (Android emulator usually uses `http://10.0.2.2:8000/api`).
2. Add the RevenueCat public platform API key(s). The app remains usable in Free mode when keys are omitted.
3. Start the backend, then run `npm install` and `npm start` in this directory.

RevenueCat uses the `pro` entitlement. Purchases require an Expo development build; Expo Go can be used for UI preview but does not provide a production purchase environment.

## Development builds

Run `npm run config:check` before creating a build. EAS profiles are defined in `eas.json`:

- `development`: internal development client for physical devices
- `ios-simulator`: development client for the iOS Simulator
- `preview`: internal production-like team build
- `production`: store build with automatic build-number incrementing

The repository intentionally does not set `ios.bundleIdentifier`, `android.package`, an EAS project ID, or RevenueCat dashboard values. Confirm ownership with the team, link the intended Expo account, and then configure these values. See `docs/stages/STAGE_4A_DEVELOPMENT_BUILD.md` for the checklist.

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
