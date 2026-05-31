import type { Locator, Page } from '@playwright/test';

export class AddToCalendarPage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly googleCalendarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.locator('div').filter({ hasText: /^Add to calendar$/ });
    this.googleCalendarButton = page.getByRole('link', { name: 'Google' });
  }
}
