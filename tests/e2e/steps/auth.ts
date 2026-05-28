import type { HomePage } from '../pages/HomePage';
import type { LoginDialog } from '../pages/LoginDialog';
import { getTestUserCredentials } from '../utils/credentials';

export async function signInTestUser(homePage: HomePage, loginDialog: LoginDialog): Promise<void> {
  const { email, password } = getTestUserCredentials();

  await homePage.loginButton.click();
  await loginDialog.dialog.waitFor({ state: 'visible' });
  await loginDialog.fillCredentials(email, password);
  await loginDialog.clickSignIn();
  await loginDialog.dialog.waitFor({ state: 'hidden' });
}
