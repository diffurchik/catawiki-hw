import { HomePage } from '../pages/HomePage';
import { LoginDialog } from '../pages/LoginDialog';
import { LotPage } from '../pages/LotPage';
import { SearchResultPage } from '../pages/SearchResultPage';
import { AddToCalendarPage } from '../pages/AddToCalendarPage';
import { LotSteps } from '../steps/lot.steps';
import { expectNewTabUrl, GOOGLE_CALENDAR_URL_PATTERN } from '../utils/newTabUrl';
import { loggedInDescribe, test } from '../fixtures';
import { expect } from '@playwright/test';
const searchQuery = 'train';
const resultIndex = 1;

test.describe('lot page for not logged in user', () => {
  test('open specific product', async ({ page }) => {
    const searchResultsPage = new SearchResultPage(page);
    const lotPage = new LotPage(page);
    const homePage = new HomePage(page);

    await homePage.search(searchQuery);
    await expect(searchResultsPage.headingByName(searchQuery)).toBeVisible();
    const titles = await searchResultsPage.results.allTextContents();

    expect(titles.some((title) => title.toLowerCase().includes(searchQuery))).toBeTruthy();

    const expectedTitle = await searchResultsPage.getResultTitle(resultIndex).textContent();

    await searchResultsPage.getResult(resultIndex).waitFor({ state: 'visible' });
    await searchResultsPage.openResult(resultIndex);

    await expect(lotPage.headingByName(searchQuery)).toBeVisible();
    await expect(lotPage.headingByName(searchQuery)).toHaveText(expectedTitle ?? '');
    console.log('Lot title: ', await lotPage.headingByName(searchQuery).textContent()); // Test assessment requirement 1

    await expect(lotPage.favouriteButton).toBeVisible();
    console.log('Favourite number: ', await lotPage.getFavouriteCount()); // Test assessment requirement 2

    await expect(lotPage.currentBid).toBeVisible();
    console.log('Current bid: ', await lotPage.currentBid.textContent()); // Test assessment requirement 3
  });

  test('User can not add product to favourites if not logged in', async ({ page }) => {
    const lotPage = new LotPage(page);
    const loginDialog = new LoginDialog(page);
    const lotSteps = new LotSteps(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);
    await expect(lotPage.favouriteButton).toBeVisible();

    await lotPage.favouriteButton.click();
    await expect(loginDialog.dialog).toBeVisible();
  });

  test('User can not place a bid if not logged in', async ({ page }) => {
    const lotPage = new LotPage(page);
    const loginDialog = new LoginDialog(page);
    const lotSteps = new LotSteps(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);
    await expect(lotPage.currentBid).toBeVisible();

    await lotPage.placeBidButton.click();
    await expect(loginDialog.dialog).toBeVisible();
  });

  test('User can see quick bid buttons', async ({ page }) => {
    const lotPage = new LotPage(page);
    const lotSteps = new LotSteps(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);
    await expect(lotPage.quickBidButton).toBeVisible();
  });

  test('User can see bidding counter', async ({ page }) => {
    const lotPage = new LotPage(page);
    const lotSteps = new LotSteps(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);
    await expect(lotPage.biddingCounter).toBeVisible();
  });

  test('User can open "Add to calendar" modal and click on Google calendar button', async ({
    page,
  }) => {
    const lotPage = new LotPage(page);
    const lotSteps = new LotSteps(page);
    const addToCalendarPage = new AddToCalendarPage(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);
    await expect(lotPage.addToCalendarButton).toBeVisible();
    await lotPage.addToCalendarButton.click();
    await expect(addToCalendarPage.dialog).toBeVisible();

    await expectNewTabUrl(
      page,
      () => addToCalendarPage.googleCalendarButton.click(),
      GOOGLE_CALENDAR_URL_PATTERN,
    );
  });
});

loggedInDescribe('lot page for logged in user', () => {
  test('User can add product to favourites if logged in', async ({ page }) => {
    const lotPage = new LotPage(page);
    const lotSteps = new LotSteps(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);
    await expect(lotPage.favouriteButton).toBeVisible();

    const currentFavouriteCount = await lotPage.getFavouriteCount();
    await lotPage.favouriteButton.click();
    const newFavouriteCount = await lotPage.getFavouriteCount();
    expect(newFavouriteCount).toBe(
      Number(currentFavouriteCount ? parseInt(currentFavouriteCount, 10) + 1 : 1),
    );
  });

  test('User sees notification when trying to place a bid without amount', async ({ page }) => {
    const lotPage = new LotPage(page);
    const lotSteps = new LotSteps(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);

    await lotPage.placeBidButton.click();
    await expect(lotPage.errorMessage).toHaveText('Please insert a valid bid amount');
    await expect(lotPage.errorMessage).toBeVisible();
  });

  test('User can see favourite lots on home page', async ({ page }) => {
    const homePage = new HomePage(page);
    const lotPage = new LotPage(page);
    const lotSteps = new LotSteps(page);

    await lotSteps.navigateToLot(searchQuery, resultIndex);

    await lotPage.favouriteButton.click();
    await homePage.open();
    await expect(homePage.favouriteLots).toBeVisible();
  });
});
