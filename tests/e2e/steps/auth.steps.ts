import test from '@playwright/test';
import type { HomePage } from '../pages/HomePage';
import type { LoginDialog } from '../pages/LoginDialog';
import { getTestUserCredentials } from '../utils/env';

export async function signInTestUser(homePage: HomePage, loginDialog: LoginDialog): Promise<void> {
  await test.step('Sign in', async () => {
    const { email, password } = getTestUserCredentials();

    await homePage.loginButton.click();
    await loginDialog.dialog.waitFor({ state: 'visible' });
    await loginDialog.fillCredentials(email, password);
    await loginDialog.signInButton.click();
    await loginDialog.dialog.waitFor({ state: 'hidden' });
  });
}
