import type { Locator, Page } from '@playwright/test';

import { getBaseUrl } from '../utils/baseUrl';

export class HomePage {
  readonly page: Page;
  readonly searchCombobox: Locator;
  readonly searchButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchCombobox = page.getByRole('combobox', {
      name: 'Search for brand, model,',
    });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.loginButton = page
      .locator('#cw-header-container')
      .getByRole('button', { name: 'Sign in' });
  }

  async open(): Promise<void> {
    await this.page.goto(getBaseUrl());
    await this.page.waitForLoadState('domcontentloaded');
    await this.page
      .getByRole('button', { name: 'Accept All' })
      .click({ timeout: 3_000 })
      .catch(() => {});
  }

  async fillSearch(query: string): Promise<void> {
    await this.searchCombobox.click();
    await this.searchCombobox.fill(query);
  }

  async submitSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async search(query: string): Promise<void> {
    await this.fillSearch(query);
    await this.submitSearch();
  }
}
