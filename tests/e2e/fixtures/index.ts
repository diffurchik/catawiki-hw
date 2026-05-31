import { test as base } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { LoginDialog } from '../pages/LoginDialog';
import { signInTestUser } from '../steps/auth.steps';
import { hasTestUserCredentials } from '../utils/env';

type AuthOptions = {
  loggedIn: boolean;
};

type TestFixtures = AuthOptions & {
  _prepareApp: void;
};

export const test = base.extend<TestFixtures>({
  loggedIn: [false, { option: true }],

  _prepareApp: [
    async ({ page, loggedIn }, use) => {
      await new HomePage(page).open();

      if (loggedIn) {
        test.skip(!hasTestUserCredentials(), 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD in .env');
        await signInTestUser(new HomePage(page), new LoginDialog(page));
      }

      await use(undefined);
    },
    { auto: true },
  ],
});

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
