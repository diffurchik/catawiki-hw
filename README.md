# catawiki-hw

TypeScript Playwright E2E test project with ESLint, Prettier, Husky pre-commit checks, and Allure reporting.

## Setup

```bash
npm install
npm run browsers:install
```

Optional local environment:

```bash
cp .env.example .env
```

## Scripts

- `npm run test:e2e` - run Playwright tests.
- `npm run test:e2e:headed` - run tests in headed browser mode.
- `npm run test:e2e:ui` - open Playwright UI mode.
- `npm run lint` - run ESLint.
- `npm run format:check` - check Prettier formatting.
- `npm run typecheck` - run TypeScript type checking.
- `npm run report:allure` - generate an Allure HTML report from `allure-results`.
- `npm run report:open` - open the generated Allure report.

## Structure

```text
tests/
  e2e/
    auth/        # Login flow and global setup (storage state)
    fixtures/    # Extended test / expect and authenticatedDescribe
    pages/       # Page Object classes (locators, actions, page-level assertions)
    specs/       # E2E test specs
    utils/       # Shared test data and helpers
    .auth/       # Generated session (gitignored)
```

## Architecture

### Page Objects

Each page class owns its locators, user actions, and page-specific assertions (for example `expectLoaded()`). Specs instantiate page objects from the Playwright `page` fixture.

### When to add more layers

- **Custom fixtures** — when several specs share non-trivial setup (auth, API clients, seeded state).
- **Steps layer** — when a workflow spans multiple pages and is reused across tests.

### Authentication

Credentials live in `.env` (`E2E_USER_EMAIL`, `E2E_USER_PASSWORD`). Before the test run, `globalSetup` signs in once via `POST /en/accounts/signin` (API) and saves session cookies to `tests/e2e/.auth/user.json`. Playwright injects that file into the browser context with `storageState`, so tests start already logged in — no UI login step.

- Guest tests use the default `page` fixture (no login).
- Authenticated tests use `authenticatedDescribe()` from `tests/e2e/fixtures`, which applies the saved `storageState`.

If credentials are missing, guest tests still run; authenticated tests are skipped.

The default `BASE_URL` is configured in `playwright.config.ts` and can be overridden with an environment variable:

```bash
BASE_URL=https://example.com npm run test:e2e
```
