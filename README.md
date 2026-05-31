# catawiki-hw

TypeScript Playwright E2E test project with ESLint, Prettier, and Husky pre-commit checks.

## Setup

```bash
npm install
npm run browsers:install
```

Optional local environment:

```bash
cp .env.example .env
# Set E2E_USER_EMAIL and E2E_USER_PASSWORD for logged-in tests
```

## Scripts

- `npm run test:e2e` - run Playwright tests (headless, Chromium / Firefox / WebKit).
- `npm run test:e2e:headed` - run tests with a visible browser.
- `npm run test:e2e:ui` - open Playwright UI mode.
- `npm run lint` - run ESLint.
- `npm run format:check` - check Prettier formatting.
- `npm run typecheck` - run TypeScript type checking.

## Structure

```text
tests/e2e/
  fixtures/    # Extended test and loggedInDescribe
  pages/       # Page Object classes (locators and actions)
  specs/       # E2E test specs
  steps/       # Reusable multi-page workflows
  utils/       # Env helpers, new-tab URL assertions
```

## Architecture

### Page Objects

Each page class owns its locators and user actions. Specs instantiate page objects from the Playwright `page` fixture.

### Steps layer

[`tests/e2e/steps/lot.steps.ts`](tests/e2e/steps/lot.steps.ts) encapsulates search → open lot navigation reused across tests.

### Authentication

Credentials live in `.env` (`E2E_USER_EMAIL`, `E2E_USER_PASSWORD`).

- **Guest tests** use the extended `test` fixture from [`tests/e2e/fixtures/index.ts`](tests/e2e/fixtures/index.ts). An auto fixture opens the home page and dismisses the cookie banner when present.
- **Logged-in tests** use `loggedInDescribe()`, which sets `loggedIn: true` and signs in through the UI via [`tests/e2e/steps/auth.steps.ts`](tests/e2e/steps/auth.steps.ts) before each test in that block.

If credentials are missing, guest tests still run; logged-in tests are skipped.

### Assessment output

The first guest test (`open specific product`) logs the lot title, favourite count, and current bid to the console per the assignment brief. Those `console.log` calls are intentional and are not replaced with extra assertions.

### Browsers and headless mode

[`playwright.config.ts`](playwright.config.ts) runs specs on Chromium, Firefox, and WebKit. Tests run headless by default; use `npm run test:e2e:headed` for local debugging.

### Base URL

Default `BASE_URL` is `https://www.catawiki.com` and can be overridden:

```bash
BASE_URL=https://example.com npm run test:e2e
```

## Scope and trade-offs

Many additional scenarios are possible on Catawiki, but these tests run against **production**. Extra cases were intentionally not added—even as skipped or muted tests—because they would increase risk to real lots (bids, favourites, and other state changes).

The project has scalability limitations (UI login per logged-in test, repeated navigation, a single spec file). For a take-home assignment, deeper architecture (API auth, `storageState`, test data factories, parallel-safe users) would be over-engineering for the stated scope.

## Reports

Playwright generates an HTML report under `playwright-report/` after a test run. That directory is gitignored and should not be committed; delete it locally or let the next run overwrite it.

## CI

GitHub Actions workflow [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) runs typecheck, lint, format check, and E2E tests on push and pull requests to `main`.

Optional repository secrets for full coverage:

- `E2E_USER_EMAIL`
- `E2E_USER_PASSWORD`

Without these secrets, guest tests run; logged-in tests are skipped.
