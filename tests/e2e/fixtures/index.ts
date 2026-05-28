import { test as base, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { LoginDialog } from '../pages/LoginDialog';
import { LotPage } from '../pages/LotPage';
import { SearchResultPage } from '../pages/SearchResultPage';
import { signInTestUser } from '../steps/auth';
import { hasTestUserCredentials } from '../utils/credentials';

type PageObjectFixtures = {
  homePage: HomePage;
  searchResultsPage: SearchResultPage;
  lotPage: LotPage;
  loginDialog: LoginDialog;
};

type AuthOptions = {
  /** When true, opens the app and signs in before each test. */
  loggedIn: boolean;
};

type TestFixtures = PageObjectFixtures &
  AuthOptions & {
    _prepareApp: void;
  };

export const test = base.extend<TestFixtures>({
  loggedIn: [false, { option: true }],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultPage(page));
  },
  lotPage: async ({ page }, use) => {
    await use(new LotPage(page));
  },
  loginDialog: async ({ page }, use) => {
    await use(new LoginDialog(page));
  },

  _prepareApp: [
    async ({ homePage, loginDialog, loggedIn }, use) => {
      await homePage.open();

      if (loggedIn) {
        test.skip(!hasTestUserCredentials(), 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD in .env');
        await signInTestUser(homePage, loginDialog);
      }

      await use(undefined);
    },
    { auto: true },
  ],
});

export { expect };

/**
 * Describe block for tests that need a logged-in user.
 * Equivalent to `test.use({ loggedIn: true })` on the block.
 */
export function loggedInDescribe(title: string, callback: () => void): void {
  test.describe(title, () => {
    test.use({ loggedIn: true });
    callback();
  });
}
