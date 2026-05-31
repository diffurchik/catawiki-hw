import { test, type Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SearchResultPage } from '../pages/SearchResultPage';

export class LotSteps {
  readonly homePage: HomePage;
  readonly searchResultsPage: SearchResultPage;

  constructor(private readonly page: Page) {
    this.homePage = new HomePage(page);
    this.searchResultsPage = new SearchResultPage(page);
  }

  async navigateToLot(searchQuery: string, resultIndex: number): Promise<void> {
    await test.step('Search for lot', async () => {
      await this.homePage.search(searchQuery);
      await this.searchResultsPage.getResult(resultIndex).waitFor({ state: 'visible' });
      await this.searchResultsPage.openResult(resultIndex);
    });
  }
}
