import { expect, loggedInDescribe, test } from '../fixtures';

test.describe('lot page for not logged in user', () => {
  test('open specific product', async ({ homePage, searchResultsPage, lotPage }) => {
    await homePage.search('train');

    await expect(searchResultsPage.headingByName(/train/i)).toBeVisible();

    await searchResultsPage.openResult(1);

    await expect(lotPage.heading(/Train/i)).toBeVisible();
    console.log('Lot title: ', await searchResultsPage.getResultTitle(1).textContent()); // Test assesment requirement 1

    await expect(lotPage.favouriteButton).toBeVisible();
    console.log('Favourite number: ', await lotPage.getFavouriteCount()); // Test assesment requirement 2

    await expect(lotPage.currentBid).toBeVisible();
    console.log('Current bid: ', await lotPage.currentBid.textContent()); // Test assesment requirement 3
  });

  test('User can not add product to favourites if not logged in', async ({
    homePage,
    searchResultsPage,
    lotPage,
    loginDialog,
  }) => {
    await homePage.search('train');

    await expect(searchResultsPage.headingByName(/train/i)).toBeVisible();

    await searchResultsPage.openResult(1);

    await expect(lotPage.heading(/Train/i)).toBeVisible();
    await expect(lotPage.favouriteButton).toBeVisible();

    await lotPage.favouriteButton.click();
    await expect(loginDialog.dialog).toBeVisible();
  });

  test('User can not place a bid if not logged in', async ({
    homePage,
    searchResultsPage,
    lotPage,
    loginDialog,
  }) => {
    await homePage.search('train');

    await expect(searchResultsPage.headingByName(/train/i)).toBeVisible();

    await searchResultsPage.openResult(1);

    await expect(lotPage.heading(/Train/i)).toBeVisible();
    await expect(lotPage.currentBid).toBeVisible();

    await lotPage.placeBidButton.click();
    await expect(loginDialog.dialog).toBeVisible();
  });
});

loggedInDescribe('lot page for logged in user', () => {
  test('User can add product to favourites if logged in', async ({
    homePage,
    searchResultsPage,
    lotPage,
  }) => {
    await homePage.search('train');

    await expect(searchResultsPage.headingByName(/train/i)).toBeVisible();

    await searchResultsPage.openResult(1);

    await expect(lotPage.heading(/Train/i)).toBeVisible();
    await expect(lotPage.favouriteButton).toBeVisible();

    const currentFavouriteCount = await lotPage.getFavouriteCount();
    await lotPage.favouriteButton.click();
    const newFavouriteCount = await lotPage.getFavouriteCount();
    expect(newFavouriteCount).toBe(
      Number(currentFavouriteCount ? parseInt(currentFavouriteCount, 10) + 1 : 1),
    );
  });

  test('User see notification when trying to place a bid without amount', async ({
    homePage,
    searchResultsPage,
    lotPage,
  }) => {
    await homePage.search('train');

    await expect(searchResultsPage.headingByName(/train/i)).toBeVisible();

    await searchResultsPage.openResult(1);

    await expect(lotPage.heading(/Train/i)).toBeVisible();
    await expect(lotPage.currentBid).toBeVisible();

    await lotPage.placeBidButton.click();
    await expect(lotPage.errorMessage).toHaveText('Please insert a valid bid amount');
    await expect(lotPage.errorMessage).toBeVisible();
  });
});
