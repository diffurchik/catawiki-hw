import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class SearchResultPage {
  readonly page: Page;
  readonly results: Locator;

  constructor(page: Page) {
    this.page = page;
    this.results = page.locator('[data-testid^="lot-card-container-"]');
  }

  headingByName(name: string | RegExp): Locator {
    return this.page.getByRole('heading', { name });
  }

  getResult(index: number): Locator {
    return this.results.nth(index);
  }

  getResultTitle(index: number): Locator {
    return this.getResult(index).locator('.c-lot-card__title');
  }

  async openResult(index: number): Promise<void> {
    await this.getResult(index).click();
  }

  async expectResultVisible(index: number): Promise<void> {
    await expect(this.getResult(index)).toBeVisible();
  }
}
