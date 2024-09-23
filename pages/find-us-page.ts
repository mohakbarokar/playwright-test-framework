import { Page, expect } from "@playwright/test";
import { findUsPageLocators } from "../locators/find-us-page-locators";
import { FIND_US_PAGE_CONSTANTS } from "../constants/find-us-page-constants";
import { genericLocators } from "../locators/generic-locators";

/**
 * FindUsPage class provides utility methods for all Find Us page interactions and verifications.
 */
export class FindUsPage {

    private page: Page

    /**
     * Constructor to initialize the FindUsPage instance.
     * @param page - The Playwright Page object representing the current page.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Verify Find Us functionality
     * 
     * This method uses the base URL defined in the URL constants to navigate to the home page.
     */
    async findPolestarLocation(searchQuery: string): Promise<void> {
        console.log(`Searching for Polestar location with query: ${searchQuery}`);

        // Type the search query into the autocomplete input field
        const autocompleteInput = this.page.locator(findUsPageLocators.AUTOCOMPLETE_INPUT_XPATH);
        await autocompleteInput.waitFor({ state: 'visible', timeout: FIND_US_PAGE_CONSTANTS.FIND_US_PAGE_LOAD_TIMEOUT });
        await autocompleteInput.clear();
        await autocompleteInput.fill(searchQuery);

        // Wait for the autocomplete options to be displayed
        const autocompleteOptions = this.page.locator(findUsPageLocators.AUTOCOMPLTE_OPTIONS_LIST_XPATH);
        await autocompleteOptions.waitFor({ state: 'visible', timeout: FIND_US_PAGE_CONSTANTS.FIND_US_PAGE_LOAD_TIMEOUT });

        // removing spaces for comparison
        const normalizedQuery = searchQuery.replace(/\s+/g, '').toLowerCase();
        // Wait until the loading text disappears
        const loadingTextLocator = this.page.getByText(findUsPageLocators.LOADING_TEXT);
        try {
            await loadingTextLocator.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
            console.log('No loading message or it disappeared quickly.');
        }

        // Verify that each option displayed starts with the entered search query
        const optionCount = await autocompleteOptions.count();
        console.log(`Found ${optionCount} options for the query: ${searchQuery}`);

        for (let i = 0; i < optionCount; i++) {
            const optionText = await autocompleteOptions.nth(i).innerText();

            // Normalize option text (remove spaces) for comparison
            const normalizedOptionText = optionText.replace(/\s+/g, '').toLowerCase();
            expect(normalizedOptionText.startsWith(normalizedQuery),
                `Option text: "${normalizedOptionText}" should start with the search query "${normalizedQuery}"`).toBe(true);
        }

        console.log('Autocomplete options have been verified.');

        // getting text for first Option
        const firstOptionName = (await autocompleteOptions.first().innerText()).trim();

        // Select the first option in the autocomplete list
        await autocompleteOptions.first().click();

        // Locate the label that contains the result text
        const resultLabelLocator = this.page.locator(findUsPageLocators.RESULT_LABEL_XPATH);
        const resultLabel = await resultLabelLocator.innerText();
        console.log(`Result Label Text: ${resultLabel}`);

        // Split the text at "Resultat" to extract the location name (word before "Resultat")
        const locationName = resultLabel.split('Resultat')[0].trim(); // Get the word before "Resultat" and trim any spaces

        console.log(`Extracted Location Name: ${locationName}`);

        // Verify that the location name matches the search query (case-insensitive comparison)
        expect(locationName.toLowerCase(), `Expected location name: "${locationName}" to match selected first option: "${firstOptionName}"`).toBe(firstOptionName.toLowerCase());

        //Navigating Back to search input
        await this.page.locator(genericLocators.BUTTON_WITH_TEXT(findUsPageLocators.BACK_BTN_TEXT)).click();
        await autocompleteInput.waitFor({ state: 'visible', timeout: FIND_US_PAGE_CONSTANTS.FIND_US_PAGE_LOAD_TIMEOUT });

        //Closing previous search 
        await this.page.locator(findUsPageLocators.CLOSE_SEARCH_BTN_XPATH).click();
    }
}