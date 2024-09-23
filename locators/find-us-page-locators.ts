export const findUsPageLocators = {
    SPACES_HEADING_LABEL_XPATH: `//h1[@data-testid='label-heading']`,
    AUTOCOMPLETE_LABEL_XPATH: `//div[@id='autocomplete-field-:rq:-container']`,
    AUTOCOMPLETE_INPUT_XPATH: `//input[@role='search']`,
    AUTOCOMPLTE_OPTIONS_LIST_XPATH: `//button[@role='option']`,
    LOADING_TEXT: 'Laddar',
    RESULT_LABEL_XPATH: `//h1[@data-testid='label-heading' and contains(., 'Resultat')]`,
    BACK_BTN_TEXT: 'Tillbaka till sök',
    CLOSE_SEARCH_BTN_XPATH: `//input[@role='search']/following-sibling::div/button`
};