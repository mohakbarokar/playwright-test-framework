// import { Page } from '@playwright/test';

// export class HomePage {
//     readonly page: Page;

//     constructor(page: Page) {
//         this.page = page;
//     }

//     // Define locators
//     homePageTitle = async () => this.page.title();
//     aboutUsLink = async () => this.page.locator('text=About Us');


//     // Define page actions
//     async navigateToHomePage() {
//         await this.page.goto('/');
//     }

//     async clickAboutUsLink() {
//         await (await this.aboutUsLink()).click();
//     }

//     async clickOnOptionByTitle(page: any, title: string) {
//         console.log(`Clicking on title : ${title}`)
//         await page.locator(`a[title="${title}"]`).click();
//     }
// }

// src/pages/HomePage.ts

import { Page } from '@playwright/test';
import { homePageLocators } from '../locators/home-page-locators'; // Import locators
import { HOME_PAGE_CONSTANTS } from '../constants/home-page-constants';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Define page actions
    async navigateToHomePage() {
        await this.page.goto(HOME_PAGE_CONSTANTS.HOME_PAGE_URL);
    }

    async clickAboutUsLink() {
        await this.page.locator(homePageLocators.ABOUT_US_LINK).click();
    }

    async clickOnOptionByTitle(title: string) {
        console.log(`Clicking on title: ${title}`);
        await this.page.locator(`a[title="${title}"]`).click();
    }
}