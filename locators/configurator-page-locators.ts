export const configuratorPageLocators = {
    CONFIGURATOR_GALLERY_ID: '#gallery-stage',
    CONFIGURATOR_MAIN_CONTENT_ID: '#main-content',
    CONTINUE_BTN_XPATH: `(//button[@data-track-link='polestar-4_config_ux:finance_cta_click_continue'])[1]`,
    SELECT_LONG_RANGE_BTN_TEXT: 'Long range Dual motor',
    PERFORMANCE_PACKAGE_CHECKBOX_XPATH: `//input[@value='Performance-paketet']`,
    FINAL_PRICE_TEXT_XPATH: `//button[@data-track-link='polestar-4_config_ux:finance_drawer_click']/preceding-sibling::div//div/h3`,
    ORDER_CHECKOUT_XPATH: `//h1[@aria-label='Din order']`,
    SUBMIT_CUSTOMER_DETAILS_BTN_DATA_TEST_ID: 'submit-customer-details-button',
    TOTAL_ORDER_VALUE_TEXT_XPATH: `//div[text()='Totalt ordervärde']/parent::div/following-sibling::div/div`,
    CONFIRM_FINANCE_CHOICE_BTN_DATA_TEST_ID: 'fsa-pi-btn-confirm-choice',
    DIRECT_PAYMENT_VIA_BANK_TRANSFER_RADIO_BTN_ID: '[id="2092883"]',
    LOANS_FROM_THIRD_PARTY_RADIO_BTN_ID: '[id="-94596240"]',
    CONFIRM_PAYMENT_BTN_TEXT: 'Bekräfta'
};