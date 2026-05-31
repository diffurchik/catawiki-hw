import { expect, type Page } from '@playwright/test';

export const GOOGLE_CALENDAR_URL_PATTERN =
  /https:\/\/([^/]+\.)?google\.com\/.*calendar|workspace\.google\.com\/.*calendar/i;

export async function expectNewTabUrl(
  page: Page,
  openTab: () => Promise<void>,
  expectedUrl: string | RegExp,
): Promise<void> {
  const newPagePromise = page.context().waitForEvent('page');
  await openTab();
  const newPage = await newPagePromise;
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(expectedUrl);
}
