import type { Locator, Page } from '@playwright/test';

export class LotPage {
  readonly page: Page;
  readonly favouriteButton: Locator;
  readonly currentBid: Locator;
  readonly placeBidButton: Locator;
  readonly errorMessage: Locator;
  readonly quickBidButton: Locator;
  readonly biddingCounter: Locator;
  readonly addToCalendarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.favouriteButton = page.locator('button[title="favourite"]').first();
    this.currentBid = page.getByTestId('lot-bid-status-section').getByText('€');
    this.placeBidButton = page.getByRole('button', { name: 'Place bid' }).first();
    this.errorMessage = page.locator('[data-test-mode="critical"]');
    this.quickBidButton = page.getByTestId('quick-bid-buttons').getByText('€');
    this.biddingCounter = page.getByTestId('lot-bidding-counter');
    this.addToCalendarButton = page
      .getByTestId('bid-status-bar')
      .getByRole('button')
      .filter({ hasText: /^$/ });
  }

  headingByName(name: string | RegExp): Locator {
    return this.page.getByRole('heading', { name });
  }

  getFavouriteCount(): Promise<string | null> {
    return this.favouriteButton.textContent();
  }
}
