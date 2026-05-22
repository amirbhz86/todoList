# TaskFlow (Expo + React Native)

Offline-first task manager built with TypeScript, Redux Toolkit, Redux Saga, and expo-sqlite.

## Features

- View, create, edit, and delete tasks
- Cycle task status (todo → in progress → done)
- Search and filter by status and priority
- Offline storage with SQLite (source of truth for initial load)
- Optimistic UI updates with rollback on failure
- Sync queue for pending changes (mock remote API)
- Material 3 Expressive design system
- Reanimated transitions and spring interactions

## Architecture

```
src/
  domain/types/       # Task model
  utils/              # Pure helpers (+ unit tests)
  infrastructure/     # SQLite + sync queue
  store/              # Redux Toolkit slice + sagas
  theme/              # Material 3 tokens
  components/ui/      # Reusable UI primitives
  features/tasks/     # Task-specific UI
  app/                # Expo Router screens
```

## Scripts

```bash
yarn start      # Expo dev server
yarn test       # Unit tests (utilities)
yarn lint       # ESLint
```

## State flow

1. App boot → `initializeDatabase()` → saga loads tasks from SQLite
2. User action → optimistic Redux update → saga persists to SQLite → enqueue sync
3. Sync saga processes queue when online (simulated API)

## Tech stack

- Expo SDK 54, React Native 0.81
- Redux Toolkit + Redux Saga
- expo-sqlite
- react-native-reanimated

