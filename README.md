# PowerMonitor

![Version](https://img.shields.io/github/package-json/v/xhunter74/PowerMonitor.Site?path=package.json&color=blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen)

PowerMonitor is a comprehensive Angular application for monitoring, visualizing, and analyzing power consumption and system health. It supports real-time and historical data, advanced charting, localization, and robust error handling. The project is modular, scalable, and integrates with modern Angular best practices (NgRx, Material, Jest, Prettier, ESLint).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [License](#license)

## Features

- **Real-Time Monitoring**: View live power consumption and voltage/amperage data.
- **Historical Data**: Analyze hourly, daily, monthly, and yearly power data.
- **System Information**: Access platform and board version details.
- **Error Handling**: User-friendly error dialogs for system and network issues.
- **Localization**: Supports English and Ukrainian (see `assets/i18n`).
- **Material UI**: Responsive, accessible UI with Angular Material components.
- **Advanced Charting**: Visualize trends with ng2-charts and Chart.js.
- **State Management**: Uses NgRx for robust, scalable state handling.
- **Authentication & Authorization**: Route guards and JWT-based auth.
- **Modular Architecture**: Feature modules for maintainability and lazy loading.
- **Testing**: Jest unit tests for services, guards, and business logic.
- **Linting & Formatting**: Enforced with ESLint and Prettier (single quotes, auto line endings).

## Tech Stack

- **Framework**: Angular 19
- **State Management**: NgRx
- **UI**: Angular Material, ng2-charts, Bootstrap
- **Testing**: Jest
- **Linting/Formatting**: ESLint, Prettier
- **Internationalization**: ngx-translate

## Project Structure

- `src/app/components/` – UI components (power, voltage, failures, etc.)
- `src/app/models/` – TypeScript models and DTOs
- `src/app/services/` – API and business logic services
- `src/app/store/` – NgRx actions, reducers, effects
- `src/app/guards/` – Route guards (auth, role-based)
- `src/app/pipes/` – Custom pipes
- `src/app/dialogs/` – Dialog components
- `src/assets/i18n/` – Localization files
- `src/environments/` – Environment configs
- `tests/` – Jest unit tests

## Development

1. **Install dependencies**:
    ```powershell
    npm install
    ```
2. **Run the app locally**:
    ```powershell
    npm start
    ```
3. **Build for production**:
    ```powershell
    npm run build-prod
    ```

## Testing

- **Run all Jest tests**:
    ```powershell
    npm test
    ```
- Test files are in `tests/` and follow the `.spec.ts` convention.

## Linting & Formatting

- **Lint the codebase**:
    ```powershell
    npm run lint
    ```
- **Auto-fix lint and Prettier issues**:
    ```powershell
    npm run lint -- --fix
    npx prettier --write .
    ```
- Prettier and ESLint are configured for single quotes and auto line endings. VS Code will auto-format on save if you use the recommended extensions.

## License

Copyright (c) 2025 Serhiy Krasovskyy xhunter74@gmail.com
