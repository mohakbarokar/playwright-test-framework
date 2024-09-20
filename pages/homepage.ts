import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Define locators
  homePageTitle = async () => this.page.title();
  aboutUsLink = async () => this.page.locator('text=About Us');

  // Define page actions
  async navigateToHomePage() {
    await this.page.goto('/');
  }

  async clickAboutUsLink() {
    await (await this.aboutUsLink()).click();
  }
}