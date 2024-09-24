import { Page, expect } from '@playwright/test';
import { CommonPage } from './common-page';
import { genericLocators } from '../locators/generic-locators';
import { configuratorPageLocators } from '../locators/configurator-page-locators';
import { CONFIGURATOR_PAGE_CONSTANTS } from '../constants/configurator-page-constants';

/**
 * ConfiguratorPage class provides utility methods for all Configurator and Checkout page interactions and verifications.
 */
export class ConfiguratorPage {
    private page: Page;
    private commonPage: CommonPage;

    /**
     * Constructor to initialize the LoginPage instance.
     * @param page - The Playwright Page object representing the current page.
     */
    constructor(page: Page) {
        this.page = page;
        this.commonPage = new CommonPage(page);
    }

    /**
     * Selects the configuration for the car by choosing the "Long range Dual motor" option 
     * and checking the "Performance package" checkbox. 
     * It retrieves the final price displayed on the configurator and clicks the continue button.
     *
     * @returns {Promise<string>} A promise that resolves to the final price of the configured car,
     *                           formatted as a string.
     *
     * @throws {Error} If there is an issue retrieving the final price or interacting with the UI.
     */
    async selectConfigurationForCar(): Promise<string | null> {
        console.log('Selecting the "Long range Dual motor" configuration.');

        // Click on the "Long range Dual motor" button
        await this.commonPage.clickOnNavigationButton(configuratorPageLocators.SELECT_LONG_RANGE_BTN_TEXT);

        // Wait for a short duration to ensure the UI updates
        await this.page.waitForTimeout(CONFIGURATOR_PAGE_CONSTANTS.CONFIGURATION_UI_UPDATE_TIMEOUT);

        // Select the "Performance package" checkbox
        const performancePackageCheckbox = this.page.locator(configuratorPageLocators.PERFORMANCE_PACKAGE_CHECKBOX_XPATH);
        await performancePackageCheckbox.check();

        // Verify that the checkbox is checked
        const isChecked = await performancePackageCheckbox.isChecked();
        console.log(`Performance package checkbox is checked: ${isChecked}`);

        // Retrieve the final price after selections
        const finalPriceLocator = this.page.locator(configuratorPageLocators.FINAL_PRICE_TEXT_XPATH);
        const finalPriceText = await finalPriceLocator.textContent();

        // Clean up the final price text to extract the numerical value
        const finalPrice = finalPriceText?.replace(/\s+/g, ' ').trim() || null;
        console.log(`Final price: ${finalPrice}`);

        // Click on the "Continue" button to proceed
        const continueBtnLocator = this.page.locator(configuratorPageLocators.CONTINUE_BTN_XPATH);
        await continueBtnLocator.click();

        return finalPrice;
    }

    /**
     * Submits the customer details on the order page and retrieves the final total order value.
     * 
     * This method waits for the "Your Order" page to load, submits the customer details using
     * the appropriate button, and retrieves the final total order value displayed on the page.
     * 
     * @returns {Promise<string | null>} A promise that resolves to the final total order value as a cleaned-up string,
     *                                   or `null` if the value is not found.
     *
     * @throws {Error} If there is an issue interacting with the UI or retrieving the final total order value.
     */
    async submitCustomerDetails(): Promise<string | null> {
        console.log('Waiting for Your Order page to load...');

        // Wait for the "Your Order" page to load
        await this.commonPage.waitForPageToLoad(configuratorPageLocators.ORDER_CHECKOUT_XPATH, undefined, CONFIGURATOR_PAGE_CONSTANTS.CONFIGURATOR_PAGE_LOAD_TIMEOUT);

        // Click on the "Submit Customer Details" button
        const submitCustomerDetailsBtn = this.page.getByTestId(configuratorPageLocators.SUBMIT_CUSTOMER_DETAILS_BTN_DATA_TEST_ID);
        await submitCustomerDetailsBtn.click();

        // Retrieve the total order value price
        const totalOrderValuePriceLocator = this.page.locator(configuratorPageLocators.TOTAL_ORDER_VALUE_TEXT_XPATH);
        const totalOrderValuePriceText = await totalOrderValuePriceLocator.textContent();

        // Clean up the final price text to extract the numerical value
        const finalTotalOrderValue = totalOrderValuePriceText?.replace(/\s+/g, ' ').trim() || null;

        console.log(`Final Total Order Value: ${finalTotalOrderValue}`);

        return finalTotalOrderValue;
    }

    /**
     * Selects the 'Direct Payment via Bank Transfer' radio button, clicks the 'Confirm Finance Choice' button,
     * and waits for the 'Confirm Payment' button to be visible on the page.
     */
    async selectDirectPaymentAndConfirm() {
        console.log('Selecting Direct Payment via Bank Transfer option.');

        // Select the "Direct Payment via Bank Transfer" radio button
        const directPaymentRadioBtn = this.page.locator(configuratorPageLocators.DIRECT_PAYMENT_VIA_BANK_TRANSFER_RADIO_BTN_ID);
        await directPaymentRadioBtn.click();

        // Verify that the radio button is selected
        const isChecked = await directPaymentRadioBtn.isChecked();
        console.log(`Direct Payment via Bank Transfer radio button is checked: ${isChecked}`);

        // Click the "Confirm Finance Choice" button
        const confirmFinanceChoiceBtn = this.page.getByTestId(configuratorPageLocators.CONFIRM_FINANCE_CHOICE_BTN_DATA_TEST_ID);
        await confirmFinanceChoiceBtn.click();

        // Wait for the "Confirm Payment" button with the text 'Bekräfta' to be visible
        console.log('Waiting for the Confirm Payment button to be visible...');

        // Get the dynamic locator using button text
        const locator = this.page.locator(genericLocators.BUTTON_WITH_TEXT(configuratorPageLocators.CONFIRM_PAYMENT_BTN_TEXT));

        // Wait for the button to be visible
        await expect(locator, `Checking if ${configuratorPageLocators.CONFIRM_PAYMENT_BTN_TEXT} button is visible in Navigation menu`).toBeVisible();
        console.log('Confirm Payment button is now visible.');
    }
}