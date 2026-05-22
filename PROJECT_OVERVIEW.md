# TaskFlow — Project Overview

**TaskFlow** is a cross-platform task-management app built with **Expo SDK 54** and **React Native**. It demonstrates offline-first architecture: local persistence, optimistic UI, background sync, Material 3 design, and bilingual (English / Persian) support.

## What it does

Users manage tasks across three main areas:

| Tab | Purpose |
|-----|---------|
| **Tasks** | List view with search, status tabs, and a filter sheet (status + priority). Create, edit, and delete tasks via bottom sheets. |
| **Board** | Kanban-style columns (todo → in progress → done) with drag-and-drop reordering and status changes. |
| **Stats** | Summary of task counts and animated progress bars by status. |

Each task has a **title**, optional **description**, **status**, **priority** (low / medium / high), and **sort order**. Status can be cycled quickly or changed on the board.

## Technical highlights

| Area | Approach |
|------|----------|
| **Persistence** | `expo-sqlite` as source of truth on boot |
| **State** | Redux Toolkit + Redux Saga (load, CRUD, sync) |
| **Sync** | Queue of pending changes + simulated remote API with retries |
| **UI** | Material 3 Expressive theme, Reanimated animations, `@gorhom/bottom-sheet` |
| **i18n** | `i18next` with English and Persian (`fa`), RTL-aware layout |
| **Routing** | Expo Router with typed routes and tab navigation |
| **Testing** | Jest + React Native Testing Library (unit + integration tests) |

## Architecture

The codebase is feature-oriented and layered:

```
src/
  domain/types/       # Task model and filter types
  utils/              # Pure helpers (+ unit tests)
  infrastructure/     # SQLite repository + sync queue
  store/              # Redux Toolkit slice, selectors, sagas
  theme/              # Material 3 tokens and TaskFlow styling
  components/         # Shared UI (FAB, chips, sheets, navigation)
  features/           # tasks, board, stats, settings
  app/                # Expo Router screens
  i18n/               # English and Persian translations
  preferences/        # Language and app preferences (AsyncStorage)
```

### State flow

1. App boot → `initializeDatabase()` → saga loads tasks from SQLite
2. User action → optimistic Redux update → saga persists to SQLite → enqueue sync
3. Sync saga processes queue when online (simulated API)

## Platforms

Runs on **iOS**, **Android**, and **web** (static export).

## Tech stack

- Expo SDK 54, React Native 0.81, React 19
- TypeScript
- Redux Toolkit + Redux Saga
- expo-sqlite, AsyncStorage
- react-native-reanimated, react-native-gesture-handler, react-native-draggable-flatlist
- i18next / react-i18next
- Jest, React Native Testing Library

## Scripts

```bash
yarn start      # Expo dev server
yarn test       # Unit and integration tests
yarn lint       # ESLint
yarn ios        # iOS simulator
yarn android    # Android emulator
yarn web        # Web dev server
```

## Summary

TaskFlow is an offline-first task manager that combines SQLite, Redux Saga, optimistic updates, a mock sync layer, Material 3 UI, and English/Persian localization. It serves as a reference for structuring a production-style Expo + React Native app—not only a simple todo list.
